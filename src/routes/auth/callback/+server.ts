import { stravaConfig } from '$lib//server/strava-config';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { RequestEvent } from '@sveltejs/kit';

type StravaResponse = {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	athlete: {
		id: number;
	};
};

export async function GET({ cookies, url }: RequestEvent): Promise<Response> {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const storedState = cookies.get('strava_oauth_state') ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const postData = {
			client_id: stravaConfig.clientId,
			client_secret: stravaConfig.clientSecret,
			code,
			grant_type: 'authorization_code'
		};

		const response = await fetch(stravaConfig.tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});

		const data: StravaResponse = await response.json();
		console.log('strava response', data);
		const athleteId = data.athlete.id;

		const token = data.access_token;
		const refreshToken = data.refresh_token;

		const { rows: existingUser } = await db.query('SELECT * FROM auth_user WHERE id = $1 LIMIT 1', [
			athleteId
		]);

		if (existingUser.length === 0) {
			await db.query('INSERT INTO auth_user (id) VALUES ($1)', [athleteId]);
		}

		const session = await lucia.createSession(String(athleteId), { refresh_token: refreshToken });
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		cookies.set('strava_token', token, {
			path: '/',
			httpOnly: true,
			expires: new Date(data.expires_at * 1000)
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch {
		return new Response(null, { status: 500 });
	}
}

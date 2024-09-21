import qs from 'qs';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { stravaConfig } from '$lib//server/strava-config';

export function GET(event: RequestEvent) {
	const state = crypto.randomUUID();
	event.cookies.set('strava_oauth_state', state, {
		path: '/',
		httpOnly: true
	});

	const queryString = {
		client_id: stravaConfig.clientId,
		redirect_uri: 'http://localhost:5173/auth/callback',
		response_type: 'code',
		scope: stravaConfig.scopes.join(','),
		state
	};

	const stravaLink = `${stravaConfig.authorizeUrl}?${qs.stringify(queryString)}`;

	return redirect(302, stravaLink);
}

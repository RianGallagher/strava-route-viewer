import { redirect, type RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	const token = event.cookies.get('strava_token');
	redirect(302, token ? '/home' : '/login');
}

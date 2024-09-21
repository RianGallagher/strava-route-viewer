import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from '$env/static/private';

export const stravaConfig = {
	clientId: STRAVA_CLIENT_ID,
	clientSecret: STRAVA_CLIENT_SECRET,
	authorizeUrl: 'https://www.strava.com/oauth/authorize',
	tokenUrl: 'https://www.strava.com/oauth/token',
	scopes: ['read_all']
};

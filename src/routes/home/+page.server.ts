import { db } from '$lib/server/db';
import type { ServerLoadEvent } from '@sveltejs/kit';

export async function load(event: ServerLoadEvent) {
	const { rows: routes } = await db.query('SELECT * FROM routes WHERE athlete_id = $1', [
		event.locals?.user?.id
	]);

	return {
		routes
	};
}

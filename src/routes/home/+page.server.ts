import { and, db, isEqual, isGreaterThan, isLessThan, orderBy } from '$lib/server/db';
import { redirect, type Actions, type ServerLoadEvent } from '@sveltejs/kit';

interface Route {
	athlete_id: number;
	distance: number;
	elevation_gain: number;
	route_id: string;
	route_name: string;
	updated_at: Date;
}

interface RouteFilters {
	elevation_gain_lower?: number;
	elevation_gain_upper?: number;
	distance_lower?: number;
	distance_upper?: number;
	sort?: 'elevation.asc' | 'elevation.desc' | 'distance.asc' | 'distance.desc';
}

const parseFilters = (url: URLSearchParams): RouteFilters => {
	const elevation_gain_lower = url.get('elevation_gain_lower');
	const elevation_gain_upper = url.get('elevation_gain_upper');
	const distance_lower = url.get('distance_lower');
	const distance_upper = url.get('distance_upper');
	const sort = url.get('sort') as RouteFilters['sort'] | null;

	return {
		distance_lower: distance_lower ? parseFloat(distance_lower) * 1000 : 0,
		distance_upper: distance_upper ? parseFloat(distance_upper) * 1000 : 1000 * 1000,
		elevation_gain_lower: elevation_gain_lower ? parseFloat(elevation_gain_lower) : 0,
		elevation_gain_upper: elevation_gain_upper ? parseFloat(elevation_gain_upper) : 10000,
		sort: sort ?? undefined
	};
};

const buildSort = (sort: RouteFilters['sort']) => {
	switch (sort) {
		case 'elevation.asc':
			return orderBy('elevation_gain', 'ASC');
		case 'elevation.desc':
			return orderBy('elevation_gain', 'DESC');
		case 'distance.asc':
			return orderBy('distance', 'ASC');
		case 'distance.desc':
			return orderBy('distance', 'DESC');
		default:
			return orderBy('updated_at', 'DESC');
	}
};

const buildFilters = (filters: RouteFilters) => {
	const { distance_lower, distance_upper, elevation_gain_lower, elevation_gain_upper } = filters;

	const sqlFilters = and(
		[
			isLessThan('elevation_gain', elevation_gain_upper ?? 10000),
			isGreaterThan('elevation_gain', elevation_gain_lower ?? 0),
			isLessThan('distance', distance_upper ?? 1000 * 1000),
			isGreaterThan('distance', distance_lower ?? 0)
		],
		{ prefixAnd: true }
	);

	return sqlFilters;
};

export async function load(event: ServerLoadEvent) {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	const url = event.url.searchParams;
	const parsedFilters = parseFilters(url);

	const whereCaluse = buildFilters(parsedFilters);
	const orderByClause = buildSort(parsedFilters.sort);

	const { rows: routes } = await db.query<Route>(
		`SELECT * FROM routes WHERE ${isEqual('athlete_id', event.locals.user.id)} ${whereCaluse} ${orderByClause}`
	);

	const formattedRoutes = routes.map((route) => {
		return {
			...route,
			distance: (route.distance / 1000).toFixed(2),
			elevation_gain: route.elevation_gain.toFixed(2)
		};
	});

	return {
		routes: formattedRoutes
	};
}

export const actions = {
	default: async (event) => {
		const url = event.url.searchParams;

		const formData = await event.request.formData();
		for (const key of formData.keys()) {
			const formDataValue = formData.get(key);
			if (formDataValue) {
				url.set(key, String(formDataValue));
			}
		}
		redirect(302, `${event.url.pathname}?${url.toString()}`);
	}
} satisfies Actions;

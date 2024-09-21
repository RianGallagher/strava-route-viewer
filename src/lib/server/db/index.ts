import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';

export const db = createPool({ connectionString: POSTGRES_URL });

export const isEqual = (filterName: string, value: string | number) => {
	return `${filterName} = ${value}`;
};

export const isLessThan = (filterName: string, value: number) => {
	return `${filterName} <= ${value}`;
};

export const isGreaterThan = (filterName: string, value: number) => {
	return `${filterName} >= ${value}`;
};

export const and = (filters: string[], config: { prefixAnd?: boolean } = { prefixAnd: false }) => {
	const joinedFiltesr = filters.join(' AND ');
	if (config.prefixAnd ?? false) {
		return `AND ${joinedFiltesr}`;
	}
	return joinedFiltesr;
};

export const orderBy = (sortProperty: string, direction: 'ASC' | 'DESC') => {
	return `ORDER BY ${sortProperty} ${direction}`;
};

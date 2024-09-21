import { POSTGRES_URL } from '$env/static/private';
import { createPool } from '@vercel/postgres';

export const db = createPool({ connectionString: POSTGRES_URL });

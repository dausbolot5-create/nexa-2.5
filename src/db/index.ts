import * as schema from "./schema";

// Ponytail bypass: no real DB in Vercel. We rely on mockData.
// If you ever connect a real DB, swap this back to mysql2 pool.
const dummyDb: any = {
  select: () => ({ from: () => [] }),
  insert: () => ({ values: () => ({}) }),
  update: () => ({ set: () => ({ where: () => ({}) }) }),
  delete: () => ({ where: () => ({}) }),
};

export const db = dummyDb;

export async function closePool() {
  return Promise.resolve();
}

export { schema };
export type DB = typeof db;

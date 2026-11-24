/** Master data shared by several features (registration, profile, change requests). */
import { baseApi } from './baseApi';
import type { Directorate, Industry } from './types';

export const masterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDirectorates: build.query<Directorate[], void>({ query: () => '/master/directorates', keepUnusedDataFor: 3600 }),
    getIndustries: build.query<Industry[], void>({ query: () => '/master/industries', keepUnusedDataFor: 3600 }),
  }),
});

export const { useGetDirectoratesQuery, useGetIndustriesQuery } = masterApi;

/** Directorate serving a district, e.g. "Malir" -> Malir Directorate (100). */
export function directorateFor(directorates: Directorate[] | undefined, district: string | undefined): Directorate | undefined {
  return directorates?.find((d) => d.districts.includes(district || ''));
}

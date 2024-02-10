import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "./types";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL as string;

export const kpiApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/kpi/`,
    mode: 'no-cors'
  }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query() {
        return {
          url: 'kpis',
          credentials: 'include',
        };
      },
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query() {
        return {
          url: 'products',
          credentials: 'include',
        };
      },
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query() {
        return {
          url: 'transactions',
          credentials: 'include',
        };
      },
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} = kpiApi;
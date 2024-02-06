import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser } from "@/redux/features/userSlice";
import { IUser } from "@/redux/api/types";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL as string;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/users/`,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: 'me',
          credentials: 'include',
        };
      },
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
});

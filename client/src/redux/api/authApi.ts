import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginInput } from "@/scenes/login";
import { RegisterInput } from "@/scenes/register";
import { IGenericResponse, IUser } from "@/redux/api/types";
import { logout } from "@/redux/features/userSlice";
import { userApi } from './userApi';

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL as string;


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/auth/`,
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<IGenericResponse, RegisterInput>({
      query(data) {
        return {
          url: 'register',
          method: 'POST',
          body: data,
        };
      },
      transformResponse: (result: { status: string, message: string, data: { user: IUser }}) => {
        return { status: result.status, user: result.data.user, message: result.message };
      },
    }),
    sendOpt: builder.mutation<IGenericResponse, { email: string }>({
      query(data) {
        return {
          url: 'sendotp',
          method: 'POST',
          body: data,
        };
      },
    }),
    loginUser: builder.mutation<{ access_token: string; status: string, isVerified: boolean, email: string }, LoginInput>({
      query(data) {
        return {
          url: 'login',
          method: 'POST',
          body: data,
          credentials: 'include',
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.isVerified) {
            dispatch(userApi.endpoints.getMe.initiate(null, {forceRefetch: true}));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verifyEmail: builder.mutation<{ status: string, message: string, email: string }, { verificationCode: string }>({
      query({ verificationCode }) {
        return {
          url: `verifyemail/${verificationCode}`,
          method: 'POST',
        };
      },
    }),
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: 'logout',
          credentials: 'include',
        };
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        // eslint-disable-next-line no-empty
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useVerifyEmailMutation,
  useSendOptMutation,
} = authApi;

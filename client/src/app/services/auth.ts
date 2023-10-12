import { User } from "@prisma/client";
import { api } from "./api";
import { apiPaths } from "../paths";

export type UserRegisterData = Omit<User, "id" | "fail" | "success" | "image">;
export type UserLoginData = Omit<UserRegisterData, "name">;

type ResponseAuthData = User & { token: string };

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<ResponseAuthData, UserLoginData>({
			query: (userData) => ({
				url: apiPaths.user.login,
				method: "POST",
				body: userData,
			}),
		}),
		register: builder.mutation<ResponseAuthData, UserRegisterData>({
			query: (userData) => ({
				url: apiPaths.user.register,
				method: "POST",
				body: userData,
			}),
		}),
		current: builder.query<ResponseAuthData, void>({
			query: () => ({
				url: apiPaths.user.current,
				method: "GET",
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useCurrentQuery } =
	authApi;

export const {
	endpoints: { login, current, register },
} = authApi;

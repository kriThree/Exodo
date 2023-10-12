import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
const baseUrl = "http://192.168.0.11";
const baseQuery = fetchBaseQuery({
	baseUrl: `${baseUrl}:4000/`,

	prepareHeaders(headers, { getState }) {
		const token =
			(getState() as RootState).auth.user?.token ||
			localStorage.getItem("token");

		if (token && token !== null) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithRerty = retry(baseQuery, { maxRetries: 1 });

export const api = createApi({
	tagTypes: [
		"todos",
		"commands",
		"notifications",
		"users",
		"usersInCommandCard",
	],
	reducerPath: "splitApi",
	baseQuery: baseQueryWithRerty,
	refetchOnMountOrArgChange: true,
	endpoints: () => ({}),
});

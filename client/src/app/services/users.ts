import { User } from "@prisma/client";
import { api } from "./api";
import { apiPaths } from "../paths";
type setUserParams = Omit<
	User,
	"id" | "password" | "success" | "fail" | "image"
>;

export const usersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getUsersWithName: builder.query<{ message: string; users: User[] }, string>(
			{
				query: (string: string) => ({
					url: apiPaths.user.getWithName,
					method: "GET",
					params: {
						string,
					},
				}),
			}
		),
		getUserWithId: builder.query<{ message: string; user: User }, string>({
			query: (id: string) => ({
				url: apiPaths.user.getWithId,
				method: "GET",
				params: {
					userId: id,
				},
			}),
		}),
		updateUser: builder.mutation<
			{ message: string; user: User },
			setUserParams
		>({
			query: (body) => ({
				url: apiPaths.user.update,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["users"],
		}),
		updateImage: builder.mutation<{ message: string; user: User }, string>({
			query: (image) => ({
				url: apiPaths.user.updateImage,
				method: "PUT",
				body: {
					image,
				},
			}),
			invalidatesTags: ["users"],
		}),
	}),
});
export const {
	useGetUsersWithNameQuery,
	useGetUserWithIdQuery,
	useUpdateUserMutation,
	useUpdateImageMutation,
} = usersApi;

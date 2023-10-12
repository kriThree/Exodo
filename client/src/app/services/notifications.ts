import { Notification } from "@prisma/client";
import { api } from "./api";
import { apiPaths } from "../paths";
import { Command } from "concurrently";

export const notificationsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllNotifications: builder.query<{ notifications: Notification[] }, void>(
			{
				query: () => ({
					url: apiPaths.notification.getAll,
				}),
				providesTags: (result) =>
					result
						? [
								...result.notifications.map(({ id }) => ({
									type: "notifications" as const,
									id,
								})),
								{ type: "notifications", id: "LIST" },
						  ]
						: [{ type: "notifications", id: "LIST" }],
			}
		),
		rejectInvite: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: apiPaths.notification.rejectInivite,
				method: "POST",
				body: {
					notificationId: id,
				},
			}),
			invalidatesTags: ["notifications"],
		}),
		acceptInvite: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: apiPaths.notification.acceptInvite,
				method: "POST",
				body: {
					notificationId: id,
				},
			}),
			invalidatesTags: ["notifications"],
		}),
		closeDaily: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: apiPaths.notification.closeDaily,
				method: "POST",
				body: {
					notificationId: id,
				},
			}),
			invalidatesTags: ["notifications"],
		}),
		isInivited: builder.query<
			{ message: string; isInvited: boolean },
			{ userId: string; commandId: string }
		>({
			query: ({ userId, commandId }) => ({
				url: apiPaths.notification.isInvited,
				method: "GET",
				params: { userId, commandId },
			}),
		}),
	}),
});

export const {
	useGetAllNotificationsQuery,
	useAcceptInviteMutation,
	useRejectInviteMutation,
	useCloseDailyMutation,
	useIsInivitedQuery,
} = notificationsApi;

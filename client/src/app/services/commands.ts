import { Command, User } from "@prisma/client";
import { api } from "./api";
import { apiPaths } from "../paths";
import { TodosFilters } from "../../features/todos/TodoSlice";

type addCommandParams = Omit<Command, "id" | "isLocal" | "adminId">;
type inviteUserParams = {
	recepientId: string;
	commandId: string;
};
type updateUserParams = Partial<addCommandParams> & { commandId: string };
export const commandsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllCommands: builder.query<
			{ commands: Command[]; message: string },
			 void
		>({
			query: () => ({
				url: apiPaths.command.getAll,
				method: "GET",
			}),
			providesTags: (result) =>
				result
					? [
							...result.commands.map(({ id }) => ({
								type: "commands" as const,
								id,
							})),
							{ type: "commands", id: "LIST" },
					  ]
					: [{ type: "commands", id: "LIST" }],
		}),
		getCommand: builder.query<{ command: Command; message: string }, string>({
			query: (commandId) => ({
				url: apiPaths.command.get,
				method: "GET",
				params: { commandId },
			}),
		}),
		addCommand: builder.mutation<
			{ command: Command; message: string },
			addCommandParams
		>({
			query: (params) => ({
				url: apiPaths.command.add,
				method: "POST",
				body: params,
			}),
			invalidatesTags: ["commands"],
		}),

		inviteUserInCommand: builder.mutation<
			{ message: string },
			inviteUserParams
		>({
			query: (params) => ({
				url: apiPaths.command.invite,
				method: "POST",
				body: params,
			}),
			invalidatesTags: ["users"],
		}),
		updateCommand: builder.mutation<Command, updateUserParams>({
			query: (params) => ({
				url: apiPaths.command.update,
				method: "PUT",
				body: params,
			}),
		}),
		removeCommand: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: apiPaths.command.remove,
				method: "DELETE",
				body: { commandId: id },
			}),
			invalidatesTags: ["commands"],
		}),
		leaveFromCommand: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: apiPaths.command.leave,
				method: "POST",
				body: { commandId: id },
			}),
			invalidatesTags: ["users", "commands"],
		}),
		getUsersFromCommand: builder.query<
			{ users: User[]; message: string; invitedUsers: User[] },
			string
		>({
			query: (id) => ({
				url: apiPaths.command.getUsers,
				method: "GET",
				params: {
					commandId: id,
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.users.map(({ id }) => ({
								type: "users" as const,
								id,
							})),
							{ type: "users", id: "LIST" },
					  ]
					: [{ type: "users", id: "LIST" }],
		}),
	}),
});
export const {
	useGetAllCommandsQuery,
	useGetCommandQuery,
	useAddCommandMutation,
	useInviteUserInCommandMutation,
	useUpdateCommandMutation,
	useRemoveCommandMutation,
	useLeaveFromCommandMutation,
	useGetUsersFromCommandQuery,
} = commandsApi;

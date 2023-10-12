import { Todo, User } from "@prisma/client";
import { api } from "./api";
import { apiPaths } from "../paths";
import { TodosFilters } from "../../features/todos/TodoSlice";
type addTodoParams = Omit<Todo, "id">;
export const todosApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getAllTodos: builder.query<{ todos: Todo[] }, TodosFilters>({
			query: ({ commandId, tag }) => ({
				url: apiPaths.todo.getAll,
				method: "GET",
				params: {
					commandId,
					tag,
				},
			}),
			providesTags: (result) =>
				result
					? [
							...result.todos.map(({ id }) => ({ type: "todos" as const, id })),
							{ type: "todos", id: "LIST" },
					  ]
					: [{ type: "todos", id: "LIST" }],
		}),
		addTodo: builder.mutation<{ message: string; todo: Todo }, addTodoParams>({
			query: (form) => ({
				url: apiPaths.todo.add,
				method: "POST",
				body: {
					commandId: form.commandId,
					name: form.name,
					description: form.description,
					tag: form.tag,
				},
			}),
			invalidatesTags: ["todos"],
		}),
		removeTodo: builder.mutation<void, string>({
			query: (id) => ({
				url: apiPaths.todo.remove,
				method: "DELETE",
				body: {
					todoId: id,
				},
			}),
			invalidatesTags: ["todos"],
		}),
		successTodo: builder.mutation<void, string>({
			query: (id) => ({
				url: apiPaths.todo.success,
				method: "DELETE",
				body: {
					todoId: id,
				},
			}),
			invalidatesTags: ["todos"],
		}),
	}),
});
export const {
	useGetAllTodosQuery,
	useAddTodoMutation,
	useRemoveTodoMutation,
	useSuccessTodoMutation,
} = todosApi;

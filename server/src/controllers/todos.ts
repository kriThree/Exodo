import { Todo, User } from "@prisma/client";
import prisma from "../prisma-client";

import { Route } from "../types";

export const addTodo: Route = async (req, res) => {
	try {
		const form = <Todo>req.body;
		const user = <User>res.locals.user;
		if (!form || !form.name || !form.description || !form.tag) {
			return res.status(400).json({ message: "All data required" });
		}

		const command = await prisma.command.findFirst({
			where: form.commandId
				? {
						id: form.commandId,
				  }
				: {
						isLocal: true,
						adminId: user.id,
				  },
		});
		if (command) {
			if (command.adminId !== user.id) {
				return res
					.status(403)
					.json({ message: "You are not an admin of this team" });
			}
			const todo = await prisma.todo.create({
				data: {
					name: form.name,
					description: form.description,
					tag: form.tag,
					commandId: command.id,
				},
			});
			if (todo) {
				return res
					.status(200)
					.json({ message: "Task created successfully!", todo });
			}
			return res
				.status(500)
				.json({ message: "An error occurred while creating the task" });
		}
		return res.status(400).json({ message: "An error has occurred" });
	} catch (e) {
		res.status(400).json({ message: "An error occurred while adding a task" });
	}
};
export const getTodos: Route = async (req, res) => {
	try {
		const params = req.query || {};
		const user = <User>res.locals.user;

		const allCommands = await prisma.command.findMany({
			where: {
				OR: [
					{ adminId: user.id },
					{ CommandToUser: { some: { userId: user.id } } },
				],
			},
		});

		let allTodo: Todo[] = [];
		for (let index = 0; index < allCommands.length; index++) {
			const command = allCommands[index];
			if (params.commandId && command.id !== params.commandId) continue;

			let todos = await prisma.todo.findMany({
				where: {
					commandId: command.id,
				},
			});

			if (params.tag) todos = todos.filter((todo) => todo.tag === params.tag);

			allTodo = [...allTodo, ...todos];
		}

		return res
			.status(200)
			.json({ todos: allTodo, message: "Todos received successfully" });
	} catch (e) {
		res.status(400).json({ message: "Something went wrong" });
	}
};
export const removeTodo: Route = async (req, res) => {
	try {
		const todo = await prisma.todo.findFirst({
			where: {
				id: req.body.todoId,
			},
		});
		if (todo) {
			await prisma.todo.delete({
				where: {
					id: todo.id,
				},
			});

			const user = await prisma.user.findFirst({
				where: { id: res.locals.user.id },
			});

			if (user) {
				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						fail: ++user.fail,
					},
				});
			}

			return res.status(201).json({ message: "Task deleted" });
		}
		return res.status(400).json({ message: "An error has occurred"});
	} catch {
		return res
			.status(500)
			.json({ message: "An error occurred while deleting the task" });
	}
};
export const successTodo: Route = async (req, res) => {
	try {
		const todo = await prisma.todo.findFirst({
			where: {
				id: req.body.todoId,
			},
		});
		if (todo) {
			await prisma.todo.delete({
				where: {
					id: todo.id,
				},
			});

			const user = await prisma.user.findFirst({
				where: { id: res.locals.user.id },
			});

			if (user) {
				await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						success: ++user.success,
					},
				});
			}

			return res.status(201).json({ message:"Mission accomplished" });
		}
		return res.status(500).json({ message: "Task not found"});
	} catch (e) {
		return res
			.status(500)
			.json({ message: "An error occurred while executing the task"});
	}
};
export const updateTodo: Route = async (req, res) => {
	try {
		const form = req.body;
		const todo = await prisma.todo.findFirst({
			where: {
				id: req.body.todoId,
			},
		});

		if (todo) {
			await prisma.todo.update({
				where: {
					id: todo.id,
				},
				data: {
					name: form.name || todo.name,
					description: form.description || todo.description,
				},
			});
			return res.status(201).json({ message:"Task modified successfully" });
		}

		return res.status(500).json({ message:"Task not found" });
	} catch (e) {
		return res
			.status(500)
			.json({ message: "An error occurred while executing the task" });
	}
};

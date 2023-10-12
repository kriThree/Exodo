"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTodo = exports.successTodo = exports.removeTodo = exports.getTodos = exports.addTodo = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const addTodo = async (req, res) => {
    try {
        const form = req.body;
        const user = res.locals.user;
        if (!form || !form.name || !form.description || !form.tag) {
            return res.status(400).json({ message: "All data required" });
        }
        const command = await prisma_client_1.default.command.findFirst({
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
            const todo = await prisma_client_1.default.todo.create({
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
    }
    catch (e) {
        res.status(400).json({ message: "An error occurred while adding a task" });
    }
};
exports.addTodo = addTodo;
const getTodos = async (req, res) => {
    try {
        const params = req.query || {};
        const user = res.locals.user;
        const allCommands = await prisma_client_1.default.command.findMany({
            where: {
                OR: [
                    { adminId: user.id },
                    { CommandToUser: { some: { userId: user.id } } },
                ],
            },
        });
        let allTodo = [];
        for (let index = 0; index < allCommands.length; index++) {
            const command = allCommands[index];
            if (params.commandId && command.id !== params.commandId)
                continue;
            let todos = await prisma_client_1.default.todo.findMany({
                where: {
                    commandId: command.id,
                },
            });
            if (params.tag)
                todos = todos.filter((todo) => todo.tag === params.tag);
            allTodo = [...allTodo, ...todos];
        }
        return res
            .status(200)
            .json({ todos: allTodo, message: "Todos received successfully" });
    }
    catch (e) {
        res.status(400).json({ message: "Something went wrong" });
    }
};
exports.getTodos = getTodos;
const removeTodo = async (req, res) => {
    try {
        const todo = await prisma_client_1.default.todo.findFirst({
            where: {
                id: req.body.todoId,
            },
        });
        if (todo) {
            await prisma_client_1.default.todo.delete({
                where: {
                    id: todo.id,
                },
            });
            const user = await prisma_client_1.default.user.findFirst({
                where: { id: res.locals.user.id },
            });
            if (user) {
                await prisma_client_1.default.user.update({
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
        return res.status(400).json({ message: "An error has occurred" });
    }
    catch {
        return res
            .status(500)
            .json({ message: "An error occurred while deleting the task" });
    }
};
exports.removeTodo = removeTodo;
const successTodo = async (req, res) => {
    try {
        const todo = await prisma_client_1.default.todo.findFirst({
            where: {
                id: req.body.todoId,
            },
        });
        if (todo) {
            await prisma_client_1.default.todo.delete({
                where: {
                    id: todo.id,
                },
            });
            const user = await prisma_client_1.default.user.findFirst({
                where: { id: res.locals.user.id },
            });
            if (user) {
                await prisma_client_1.default.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        success: ++user.success,
                    },
                });
            }
            return res.status(201).json({ message: "Mission accomplished" });
        }
        return res.status(500).json({ message: "Task not found" });
    }
    catch (e) {
        return res
            .status(500)
            .json({ message: "An error occurred while executing the task" });
    }
};
exports.successTodo = successTodo;
const updateTodo = async (req, res) => {
    try {
        const form = req.body;
        const todo = await prisma_client_1.default.todo.findFirst({
            where: {
                id: req.body.todoId,
            },
        });
        if (todo) {
            await prisma_client_1.default.todo.update({
                where: {
                    id: todo.id,
                },
                data: {
                    name: form.name || todo.name,
                    description: form.description || todo.description,
                },
            });
            return res.status(201).json({ message: "Task modified successfully" });
        }
        return res.status(500).json({ message: "Task not found" });
    }
    catch (e) {
        return res
            .status(500)
            .json({ message: "An error occurred while executing the task" });
    }
};
exports.updateTodo = updateTodo;

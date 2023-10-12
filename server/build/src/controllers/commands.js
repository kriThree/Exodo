"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersFromCommand = exports.leaveFromCommand = exports.updateCommand = exports.inviteUserCommand = exports.removeCommand = exports.getAllCommands = exports.getCommandWithId = exports.addCommand = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const addCommand = async (req, res) => {
    const user = res.locals.user;
    const form = req.body;
    if (!form.name || !form.description) {
        return res.status(400).json({ message: "Необходимы все данные" });
    }
    if (await prisma_client_1.default.command.findFirst({
        where: {
            name: form.name,
            OR: [
                { adminId: user.id },
                { CommandToUser: { some: { userId: user.id } } },
            ],
        },
    })) {
        return res
            .status(400)
            .json({ message: "Команда с таким именем уже создана" });
    }
    const command = await prisma_client_1.default.command.create({
        data: {
            adminId: user.id,
            name: form.name,
            description: form.description,
            isLocal: false,
        },
    });
    if (command) {
        return res
            .status(200)
            .json({ message: "Команда успешно создана", command });
    }
    return res
        .status(400)
        .json({ message: "Произошла ошибка при создании команды" });
};
exports.addCommand = addCommand;
const getCommandWithId = async (req, res) => {
    try {
        const commandId = req.query.commandId;
        if (typeof commandId === "string") {
            const command = await prisma_client_1.default.command.findFirst({
                where: { id: commandId },
            });
            console.log(command, commandId);
            if (!command) {
                return res.status(400).json({ message: "Неккоректный id команды" });
            }
            return res
                .status(200)
                .json({ message: "Команда получена успешно", command });
        }
        return res.status(400).json({ message: "Неккоректный id команды" });
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка при получении команды" });
    }
};
exports.getCommandWithId = getCommandWithId;
const getAllCommands = async (req, res) => {
    try {
        const user = res.locals.user;
        const commands = await prisma_client_1.default.command.findMany({
            where: {
                OR: [
                    { adminId: user.id },
                    { CommandToUser: { some: { userId: user.id } } },
                ],
            },
        });
        return res.status(200).json({ commands });
    }
    catch {
        res.status(500).json({ message: "Произошла ошибка" });
    }
};
exports.getAllCommands = getAllCommands;
const removeCommand = async (req, res) => {
    try {
        const command = await prisma_client_1.default.command.findUnique({
            where: { id: req.body.commandId },
        });
        if (command) {
            if (command.adminId !== res.locals.user.id) {
                if (command.isLocal) {
                    return res
                        .status(400)
                        .json({ message: "Вы не можете удалить локальную команду" });
                }
                return res.status(402).json({
                    message: "Вы не являетесь владельцем этой команды для ее удаления",
                });
            }
            await prisma_client_1.default.command.delete({
                where: {
                    id: command.id,
                },
            });
            return res.status(200).json({ message: "Команда удалена" });
        }
        return res.status(500).json({ message: "Команда не найдена" });
    }
    catch {
        return res
            .status(400)
            .json({ message: "Произошла ошибка при удалении команды" });
    }
};
exports.removeCommand = removeCommand;
const inviteUserCommand = async (req, res) => {
    try {
        const form = req.body;
        if (!form.recepientId || !form.commandId) {
            return res.status(400).json({ message: "Требуется id получателя" });
        }
        const user = await prisma_client_1.default.user.findFirst({
            where: {
                id: form.recepientId,
            },
        });
        const command = await prisma_client_1.default.command.findFirst({
            where: {
                id: form.commandId,
            },
        });
        if (user && command) {
            if (command.isLocal) {
                return res.status(400).json({
                    message: "Вы не можете пригласить людей в локальную команду",
                });
            }
            if (await prisma_client_1.default.notification.findFirst({
                where: { recepientId: user.id, commandId: command.id },
            })) {
                return res.status(401).json({ message: "Приглашение уже отправлено" });
            }
            const notification = await prisma_client_1.default.notification.create({
                data: {
                    type: "invite",
                    recepientId: user.id,
                    commandId: command.id,
                    senderId: res.locals.user.id,
                },
            });
            if (notification) {
                return res.status(200).json({ message: "Приглашение отправлено" });
            }
            return res.status(400).json({ message: "Прозошла ошибка" });
        }
    }
    catch {
        return res
            .status(500)
            .json({ message: "Прозошла ошибка при отправке приглашения" });
    }
};
exports.inviteUserCommand = inviteUserCommand;
const updateCommand = async (req, res) => {
    try {
        const form = req.body;
        const command = await prisma_client_1.default.command.findFirst({
            where: { id: form.commandId },
        });
        if (command) {
            if (command.isLocal) {
                return res
                    .status(400)
                    .json({ message: "Вы не можете изменить локальную команду" });
            }
            await prisma_client_1.default.command.update({
                where: {
                    id: command.id,
                },
                data: {
                    description: form.description || command.description,
                    name: form.name || command.name,
                },
            });
            return res.status(201).json({ message: "Команда успшено изменена" });
        }
        return res
            .status(400)
            .json({ message: "Для изменения команды необходим ее id" });
    }
    catch {
        res.status(500).json({ message: "Произошла ошибка при изменении команды" });
    }
};
exports.updateCommand = updateCommand;
const leaveFromCommand = async (req, res) => {
    try {
        const command = await prisma_client_1.default.command.findFirst({
            where: { id: req.body.commandId },
        });
        const user = await prisma_client_1.default.user.findFirst({
            where: { id: res.locals.user.id },
        });
        if (command && user) {
            if (user.id === command.adminId) {
                return res.status(403).json({
                    message: "Вы не можете покинуть группу так как являетесь ее админом",
                });
            }
            const commandToUser = await prisma_client_1.default.commandToUser.findFirst({
                where: {
                    commandId: command.id,
                    userId: user.id,
                },
            });
            if (commandToUser) {
                await prisma_client_1.default.commandToUser.delete({
                    where: { id: commandToUser.id },
                });
                return res.status(200).json({ message: "Вы вышли из команды" });
            }
            return res.status(500).json({ message: "Произошла ошибка" });
        }
        return res.status(400).json({ message: "Неккоректные данные" });
    }
    catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "Произошла ошибка при выходе из команда" });
    }
};
exports.leaveFromCommand = leaveFromCommand;
const getAllUsersFromCommand = async (req, res) => {
    try {
        const users = await prisma_client_1.default.user.findMany({
            where: {
                OR: [
                    {
                        CommandToUser: {
                            some: {
                                commandId: req.body.commandId,
                            },
                        },
                    },
                    {
                        MyCommands: {
                            some: {
                                id: req.body.commandId,
                            },
                        },
                    },
                ],
            },
        });
        if (users) {
            return res
                .status(200)
                .json({ message: "Пользователи получены успешно", users });
        }
        return res.status(400).json({ message: "Неккоректные данные" });
    }
    catch {
        return res
            .status(500)
            .json({ message: "Возникла ошибка при получении пользователей" });
    }
};
exports.getAllUsersFromCommand = getAllUsersFromCommand;

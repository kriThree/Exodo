"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvited = exports.getAllNotifications = exports.closeDaily = exports.acceptInvite = exports.rejectInivite = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const rejectInivite = async (req, res) => {
    try {
        const notification = await prisma_client_1.default.notification.findFirst({
            where: { id: req.body.notificationId },
        });
        if (notification) {
            await prisma_client_1.default.notification.delete({
                where: {
                    id: notification.id,
                },
            });
            return res.status(400).json({ message: "Приглашение отклонено" });
        }
        return res
            .status(400)
            .json({ message: "Необходим корректный id для принятия уведомления" });
    }
    catch {
        res
            .status(500)
            .json({ message: "Произошла ошибка при принятии уведомления" });
    }
};
exports.rejectInivite = rejectInivite;
const acceptInvite = async (req, res) => {
    try {
        const notification = await prisma_client_1.default.notification.findFirst({
            where: { id: req.body.notificationId },
        });
        console.log(notification);
        if (notification && req.body.notificationId) {
            const command = await prisma_client_1.default.command.findUnique({
                where: { id: notification.commandId },
            });
            const user = await prisma_client_1.default.user.findFirst({
                where: { id: notification.recepientId },
            });
            if (user && command) {
                await prisma_client_1.default.commandToUser.create({
                    data: {
                        commandId: command.id,
                        userId: user.id,
                    },
                });
                await prisma_client_1.default.notification.delete({
                    where: {
                        id: notification.id,
                    },
                });
                return res.status(200).json({ message: "Вы приняты в команду" });
            }
            return res.status(400).json({ message: "Приглашение отклонено" });
        }
        return res
            .status(400)
            .json({ message: "Необходим корректный id для принятия уведомления" });
    }
    catch {
        res
            .status(500)
            .json({ message: "Произошла ошибка при принятии уведомления" });
    }
};
exports.acceptInvite = acceptInvite;
const closeDaily = (req, res) => { };
exports.closeDaily = closeDaily;
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await prisma_client_1.default.notification.findMany({
            where: { recepientId: res.locals.user.id },
        });
        if (notifications) {
            return res
                .status(200)
                .json({ message: "Уведомления получены успешно", notifications });
        }
        res.status(400).json({ message: "Произошла ошибка" });
    }
    catch {
        res
            .status(500)
            .json({ message: "Произошла ошибка при получении уведомлений" });
    }
};
exports.getAllNotifications = getAllNotifications;
const isInvited = async (req, res) => {
    try {
        console.log("e");
        if (typeof req.query.commandId !== "string" ||
            typeof req.query.userId !== "string") {
            return res.status(400).json({
                message: "Для получения уведомлений необходимы корректные id",
            });
        }
        const notifications = await prisma_client_1.default.notification.findFirst({
            where: { commandId: req.query.commandId, recepientId: req.query.userId },
        });
        const isUserInCommand = await prisma_client_1.default.command.findFirst({
            where: {
                id: req.query.commandId,
                OR: [
                    {
                        CommandToUser: {
                            some: {
                                userId: req.query.userId,
                            },
                        },
                    },
                    {
                        adminId: req.query.userId,
                    },
                ],
            },
        });
        if (isUserInCommand) {
            return res
                .status(200)
                .json({ message: "Пользователь уже в команде", isInvited: true });
        }
        if (notifications) {
            return res.status(200).json({
                message: "Пользователь уже приглашен в команду",
                isInvited: true,
            });
        }
        return res.status(200).json({
            message: "Пользователь не приглашен в команду",
            isInvited: false,
        });
    }
    catch {
        res
            .status(500)
            .json({ message: "Произошла ошибка при получении уведомлений" });
    }
};
exports.isInvited = isInvited;

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
            return res.status(400).json({ message: "Invitation declined" });
        }
        return res
            .status(400)
            .json({ message: "A valid id is required to accept the notification" });
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while accepting the notification" });
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
                return res
                    .status(200)
                    .json({ message: "You've been accepted into the team" });
            }
            return res.status(400).json({ message: "Invitation declined" });
        }
        return res
            .status(400)
            .json({ message: "A valid id is required to accept the notification" });
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while accepting the notification" });
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
            return res.status(200).json({
                message: "Notifications received successfully",
                notifications,
            });
        }
        res.status(400).json({ message: "An error has occurred" });
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while receiving notifications" });
    }
};
exports.getAllNotifications = getAllNotifications;
const isInvited = async (req, res) => {
    try {
        console.log("e");
        if (typeof req.query.commandId !== "string" ||
            typeof req.query.userId !== "string") {
            return res.status(400).json({
                message: "To receive notifications, correct ids are required",
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
                .json({ message: "The user is already on the team", isInvited: true });
        }
        if (notifications) {
            return res.status(200).json({
                message: "The user has already been invited to the team",
                isInvited: true,
            });
        }
        return res.status(200).json({
            message: "The user is not invited to the team",
            isInvited: false,
        });
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while receiving notifications" });
    }
};
exports.isInvited = isInvited;

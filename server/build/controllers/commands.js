"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersAndInvitesFromCommand = exports.leaveFromCommand = exports.updateCommand = exports.inviteUserCommand = exports.removeCommand = exports.getAllCommands = exports.getCommandWithId = exports.addCommand = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const addCommand = async (req, res) => {
    const user = res.locals.user;
    const form = req.body;
    if (!form.name || !form.description) {
        return res.status(400).json({ message: "All data required" });
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
            .json({ message: "A team with the same name has already been created" });
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
            .json({ message: "The team success created", command });
    }
    return res
        .status(400)
        .json({ message: "An error occurred while creating the command" });
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
                return res.status(400).json({ message: "Incorrect team id" });
            }
            return res
                .status(200)
                .json({ message: "Command received successfully", command });
        }
        return res.status(400).json({ message: "Incorrect team id" });
    }
    catch (error) {
        res.status(500).json({ message: "Error receiving command" });
    }
};
exports.getCommandWithId = getCommandWithId;
const getAllCommands = async (req, res) => {
    try {
        const user = res.locals.user;
        let commands = await prisma_client_1.default.command.findMany({
            where: {
                OR: [
                    { adminId: user.id },
                    { CommandToUser: { some: { userId: user.id } } },
                ],
            },
        });
        commands = commands.sort((n, e) => Number(n.isLocal) - Number(e.isLocal));
        return res.status(200).json({ commands });
    }
    catch {
        res.status(500).json({ message: "An error has occurred" });
    }
};
exports.getAllCommands = getAllCommands;
const removeCommand = async (req, res) => {
    try {
        const command = await prisma_client_1.default.command.findUnique({
            where: { id: req.body.commandId },
        });
        if (command) {
            if (command.isLocal) {
                return res
                    .status(400)
                    .json({ message: "You can't delete a local team" });
            }
            if (command.adminId !== res.locals.user.id) {
                return res.status(402).json({
                    message: "You are not the owner of this command to delete it",
                });
            }
            const todosDelete = await prisma_client_1.default.todo.deleteMany({
                where: {
                    commandId: command.id,
                },
            });
            const commandToUserDelete = await prisma_client_1.default.commandToUser.deleteMany({
                where: {
                    commandId: command.id,
                },
            });
            const notificationsDelete = await prisma_client_1.default.notification.deleteMany({
                where: {
                    commandId: command.id,
                },
            });
            if (todosDelete && commandToUserDelete && notificationsDelete) {
                await prisma_client_1.default.command.delete({
                    where: {
                        id: command.id,
                    },
                });
                return res.status(200).json({ message: "Command deleted" });
            }
            throw new Error("");
        }
        return res.status(500).json({ message: "Command not found" });
    }
    catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ message: "An error occurred while deleting the command" });
    }
};
exports.removeCommand = removeCommand;
const inviteUserCommand = async (req, res) => {
    try {
        const form = req.body;
        if (!form.recepientId || !form.commandId) {
            return res.status(400).json({ message: "Recipient ID required" });
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
                    message: "You can't invite people to your local team",
                });
            }
            if (await prisma_client_1.default.notification.findFirst({
                where: { recepientId: user.id, commandId: command.id },
            })) {
                return res
                    .status(401)
                    .json({ message: "The invitation has already been sent" });
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
                return res
                    .status(200)
                    .json({ message: "The invitation has already been sent" });
            }
            return res.status(400).json({ message: "An error has occurred" });
        }
    }
    catch {
        return res
            .status(500)
            .json({ message: "An error occurred while sending the invitation" });
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
                    .json({ message: "You can't change the local command" });
            }
            const newCommand = await prisma_client_1.default.command.update({
                where: {
                    id: command.id,
                },
                data: {
                    description: form.description || command.description,
                    name: form.name || command.name,
                },
            });
            return res.status(201).json({
                message: "The command was successfully changed",
                command: newCommand,
            });
        }
        return res
            .status(400)
            .json({ message: "To change a team, you need its id" });
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while changing the command" });
    }
};
exports.updateCommand = updateCommand;
const leaveFromCommand = async (req, res) => {
    try {
        const command = await prisma_client_1.default.command.findFirst({
            where: { id: req.body.commandId },
        });
        const leaveId = req.body.userId || res.locals.user.id;
        const user = await prisma_client_1.default.user.findFirst({
            where: { id: leaveId },
        });
        if (req.body.userId && (command === null || command === void 0 ? void 0 : command.id) !== res.locals.user.id) {
            return res.status(401).json({
                message: "You cannot remove a team member without being an admin",
            });
        }
        if (command && user) {
            if (user.id === command.adminId) {
                return res.status(403).json({
                    message: "You cannot leave the group because you are its admin",
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
                return res.status(200).json({ message: "You've left the team" });
            }
            return res.status(500).json({ message: "An error has occurred" });
        }
        return res.status(400).json({ message: "Incorrect data" });
    }
    catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ message: "An error occurred while exiting the command" });
    }
};
exports.leaveFromCommand = leaveFromCommand;
const getAllUsersAndInvitesFromCommand = async (req, res) => {
    try {
        const commandId = req.query.commandId;
        if (!commandId || typeof commandId !== "string") {
            return res.status(400).json({ message: "Team ID required" });
        }
        const users = await prisma_client_1.default.user.findMany({
            where: {
                OR: [
                    {
                        CommandToUser: {
                            some: {
                                commandId,
                            },
                        },
                    },
                    {
                        MyCommands: {
                            some: {
                                id: commandId,
                            },
                        },
                    },
                ],
            },
        });
        const invitedUsers = await prisma_client_1.default.user.findMany({
            where: {
                notifications: {
                    some: {
                        commandId,
                    },
                },
            },
        });
        if (users) {
            return res.status(200).json({
                message: "Users received successfully",
                users,
                invitedUsers: invitedUsers || [],
            });
        }
        return res.status(400).json({ message: "Incorrect data" });
    }
    catch {
        return res
            .status(500)
            .json({ message: "An error occurred while retrieving users" });
    }
};
exports.getAllUsersAndInvitesFromCommand = getAllUsersAndInvitesFromCommand;

import prisma from "../prisma-client";

import { Route } from "../types";

export const rejectInivite: Route = async (req, res) => {
	try {
		const notification = await prisma.notification.findFirst({
			where: { id: req.body.notificationId },
		});
		if (notification) {
			await prisma.notification.delete({
				where: {
					id: notification.id,
				},
			});
			return res.status(400).json({ message: "Invitation declined" });
		}
		return res
			.status(400)
			.json({ message: "A valid id is required to accept the notification" });
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while accepting the notification" });
	}
};

export const acceptInvite: Route = async (req, res) => {
	try {
		const notification = await prisma.notification.findFirst({
			where: { id: req.body.notificationId },
		});
		console.log(notification);

		if (notification && req.body.notificationId) {
			const command = await prisma.command.findUnique({
				where: { id: notification.commandId },
			});
			const user = await prisma.user.findFirst({
				where: { id: notification.recepientId },
			});
			if (user && command) {
				await prisma.commandToUser.create({
					data: {
						commandId: command.id,
						userId: user.id,
					},
				});
				await prisma.notification.delete({
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
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while accepting the notification" });
	}
};

export const closeDaily: Route = (req, res) => {};

export const getAllNotifications: Route = async (req, res) => {
	try {
		const notifications = await prisma.notification.findMany({
			where: { recepientId: res.locals.user.id },
		});
		if (notifications) {
			return res.status(200).json({
				message: "Notifications received successfully",
				notifications,
			});
		}
		res.status(400).json({ message: "An error has occurred" });
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while receiving notifications" });
	}
};
export const isInvited: Route = async (req, res) => {
	try {
		console.log("e");

		if (
			typeof req.query.commandId !== "string" ||
			typeof req.query.userId !== "string"
		) {
			return res.status(400).json({
				message: "To receive notifications, correct ids are required",
			});
		}
		const notifications = await prisma.notification.findFirst({
			where: { commandId: req.query.commandId, recepientId: req.query.userId },
		});
		const isUserInCommand = await prisma.command.findFirst({
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
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while receiving notifications" });
	}
};

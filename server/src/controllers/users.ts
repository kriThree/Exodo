import { User } from "@prisma/client";
import prisma from "../prisma-client";
import { Route } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login: Route = async (req, res) => {
	try {
		console.log("t");
		const form = req.body;
		if (!form.email || !form.password) {
			return res
				.status(400)
				.json({ message: "Please fill in the required fields" });
		}
		const { email, password } = req.body;

		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		const isPasswordCorrect =
			user && (await bcrypt.compare(password, user.password));
		const secret = process.env.JWT_SECRET;

		if (user && isPasswordCorrect && secret) {
			console.log("ttt");
			return res.status(200).json({
				id: user.id,
				email: user.email,
				name: user.name,
				token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
			});
		} else {
			return res
				.status(400)
				.json({ message: "Invalid email or password entered" });
		}
	} catch {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const register: Route = async (req, res) => {
	try {
		const form = req.body;

		if (!form.email || !form.name || !form.password) {
			return res.status(400).json({ message: "Fill in all the fields" });
		}
		const {
			email,
			name,
			password,
			image,
		}: { email: string; name: string; password: string; image?: string } = form;

		const isRegisteredUser = !!(await prisma.user.findFirst({
			where: {
				email: email,
			},
		}));

		if (isRegisteredUser) {
			return res
				.status(400)
				.json({ message: "A user with this email already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassord = await bcrypt.hash(password, salt);

		const userCreate = await prisma.user.create({
			data: {
				name,
				password: hashedPassord,
				email,
				image: image || "1",
				success: 0,
				fail: 0,
			},
		});
		if (!userCreate) {
			return res
				.status(400)
				.json({ message: "An error occurred while creating the user" });
		}
		const localCommand = await prisma.command.create({
			data: {
				name: `Personal`,
				description: `This is your local team, all your personal tasks are controlled here. A local command cannot be deleted
				You cannot connect other users to it.`,
				adminId: userCreate.id,
				isLocal: true,
			},
		});
		const user = await prisma.user.findUnique({
			where: {
				id: userCreate.id,
			},
		});
		const secret = process.env.JWT_SECRET;
		console.log(user, localCommand, secret);

		if (user && localCommand && secret) {
			console.log(user, secret);
			return res.status(201).json({
				id: user.id,
				email: user.email,
				name,
				token: jwt.sign({ id: user.id }, secret, { expiresIn: "1d" }),
			});
		}

		return res.status(400).json({ message: "Error creating user" });
	} catch (e) {
		console.log(e);

		res.status(400).json({ message: "Something went wrong" });
	}
};

export const current: Route = async (req, res) => {
	return res.status(200).json(res.locals.user);
};
export const updateUser: Route = async (req, res) => {
	try {
		const form = req.body;
		const user = await prisma.user.findFirst({
			where: { id: res.locals.user.id },
		});
		const userWithEqualEmail = await prisma.user.findFirst({
			where: { email: form?.email },
		});
		if (userWithEqualEmail && user?.id !== userWithEqualEmail.id)
			return res
				.status(400)
				.json({ message: "A user with this email already exists" });

		if (user) {
			let hashedPassord = "";
			if (form.password) {
				const salt = await bcrypt.genSalt(10);
				hashedPassord = await bcrypt.hash(form.password, salt);
			}
			await prisma.user.update({
				where: { id: user.id },
				data: {
					name: form.name || user.name,
					password: form.password ? hashedPassord : user.password,
					email: form.email || user.email,
				},
			});
			return res.status(201).json({ message: "Successfully changed" });
		}
		return res.status(500).json({ message: "User is not found" });
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while updating user data" });
	}
};
export const updateImageUser: Route = async (req, res) => {
	try {
		if (!req.body.image)
			return res
				.status(400)
				.json({ message: "To update an image you need its index" });

		const updateUser = await prisma.user.update({
			where: {
				id: res.locals.user.id,
			},
			data: {
				image: req.body.image,
			},
		});
		if (updateUser) {
			return res.status(200).json({ message: "Success", updateUser });
		}
		return res.status(400).json({ message: "index is invalid" });
	} catch {
		res
			.status(500)
			.json({ message: "An error occurred while deleting a user" });
	}
};
export const getUserWithId: Route = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: { id: String(req.query.userId) },
		});
		if (user) {
			return {
				user: await prisma.user.findUnique({ where: { id: user.id } }),
				message: "User received successfully",
			};
		}
		return res
			.status(400)
			.json({ message: "The correct id is required to obtain the user" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "An error occurred while retrieving the user" });
	}
};
export const getUserWithName: Route = async (req, res) => {
	try {
		if (!req.query.string) {
			req.query.string = "";
		}
		const user = <User>res.locals.user;

		let users = await prisma.user.findMany({
			where: {
				AND: [
					{ name: { startsWith: String(req.query.string) } },
					{ NOT: { id: user.id } },
				],
			},
		});

		return res.status(200).json({
			message: `${users && users.length} users found`,
			users,
		});
	} catch (error) {
		console.log(error);

		res
			.status(500)
			.json({ message: "An error occurred while retrieving the user" });
	}
};

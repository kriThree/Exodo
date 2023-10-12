import prisma from "../prisma-client";

import { Route } from "../types";
import jwt from "jsonwebtoken";
export const auth: Route = async (req, res, next) => {
	try {
		let token = req.headers.authorization?.split(" ")[1] || "";
		console.log(token);

		const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

		if (typeof decoded === "object" && decoded.id) {

			const user = await prisma.user.findUnique({
				where: {
					id: decoded.id,
				},
			});
			res.locals.user = user;
		} else {
			return res.status(400).json({ message: "Что-то пошло не так" });
		}

		next();
	} catch (error) {
		res.status(401).json({ message: "Не авторизован" });
	}
};

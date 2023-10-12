"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithName = exports.getUserWithId = exports.updateImageUser = exports.updateUser = exports.current = exports.register = exports.login = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    try {
        console.log("t");
        const form = req.body;
        if (!form.email || !form.password) {
            return res
                .status(400)
                .json({ message: "Please fill in the required fields" });
        }
        const { email, password } = req.body;
        const user = await prisma_client_1.default.user.findFirst({
            where: {
                email,
            },
        });
        const isPasswordCorrect = user && (await bcrypt_1.default.compare(password, user.password));
        const secret = process.env.JWT_SECRET;
        if (user && isPasswordCorrect && secret) {
            console.log("ttt");
            return res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                token: jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "1d" }),
            });
        }
        else {
            return res
                .status(400)
                .json({ message: "Invalid email or password entered" });
        }
    }
    catch {
        res.status(500).json({ message: "Something went wrong" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const form = req.body;
        if (!form.email || !form.name || !form.password) {
            return res.status(400).json({ message: "Fill in all the fields" });
        }
        const { email, name, password, image, } = form;
        const isRegisteredUser = !!(await prisma_client_1.default.user.findFirst({
            where: {
                email: email,
            },
        }));
        if (isRegisteredUser) {
            return res
                .status(400)
                .json({ message: "A user with this email already exists" });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassord = await bcrypt_1.default.hash(password, salt);
        const userCreate = await prisma_client_1.default.user.create({
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
        const localCommand = await prisma_client_1.default.command.create({
            data: {
                name: `Personal`,
                description: `This is your local team, all your personal tasks are controlled here. A local command cannot be deleted
				You cannot connect other users to it.`,
                adminId: userCreate.id,
                isLocal: true,
            },
        });
        const user = await prisma_client_1.default.user.findUnique({
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
                token: jsonwebtoken_1.default.sign({ id: user.id }, secret, { expiresIn: "1d" }),
            });
        }
        return res.status(400).json({ message: "Error creating user" });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: "Something went wrong" });
    }
};
exports.register = register;
const current = async (req, res) => {
    return res.status(200).json(res.locals.user);
};
exports.current = current;
const updateUser = async (req, res) => {
    try {
        const form = req.body;
        const user = await prisma_client_1.default.user.findFirst({
            where: { id: res.locals.user.id },
        });
        const userWithEqualEmail = await prisma_client_1.default.user.findFirst({
            where: { email: form === null || form === void 0 ? void 0 : form.email },
        });
        if (userWithEqualEmail && (user === null || user === void 0 ? void 0 : user.id) !== userWithEqualEmail.id)
            return res
                .status(400)
                .json({ message: "A user with this email already exists" });
        if (user) {
            let hashedPassord = "";
            if (form.password) {
                const salt = await bcrypt_1.default.genSalt(10);
                hashedPassord = await bcrypt_1.default.hash(form.password, salt);
            }
            await prisma_client_1.default.user.update({
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
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while updating user data" });
    }
};
exports.updateUser = updateUser;
const updateImageUser = async (req, res) => {
    try {
        if (!req.body.image)
            return res
                .status(400)
                .json({ message: "To update an image you need its index" });
        const updateUser = await prisma_client_1.default.user.update({
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
    }
    catch {
        res
            .status(500)
            .json({ message: "An error occurred while deleting a user" });
    }
};
exports.updateImageUser = updateImageUser;
const getUserWithId = async (req, res) => {
    try {
        const user = await prisma_client_1.default.user.findFirst({
            where: { id: String(req.query.userId) },
        });
        if (user) {
            return {
                user: await prisma_client_1.default.user.findUnique({ where: { id: user.id } }),
                message: "User received successfully",
            };
        }
        return res
            .status(400)
            .json({ message: "The correct id is required to obtain the user" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "An error occurred while retrieving the user" });
    }
};
exports.getUserWithId = getUserWithId;
const getUserWithName = async (req, res) => {
    try {
        if (!req.query.string) {
            req.query.string = "";
        }
        const user = res.locals.user;
        let users = await prisma_client_1.default.user.findMany({
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
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "An error occurred while retrieving the user" });
    }
};
exports.getUserWithName = getUserWithName;

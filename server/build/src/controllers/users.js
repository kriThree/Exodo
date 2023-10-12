"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.current = exports.register = exports.login = void 0;
const prisma_client_1 = __importDefault(require("../prisma-client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    try {
        const form = req.body;
        console.log('ttt');
        if (!form.email || !form.password) {
            return res
                .status(400)
                .json({ message: "Пожалуйста, заполните обязятельные поля" });
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
                .json({ message: "Неверно введена почта или пароль" });
        }
    }
    catch {
        res.status(500).json({ message: "Что-то пошло не так" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const form = req.body;
        if (!form.email || !form.name || !form.password) {
            return res.status(400).json({ message: "Заполните все поля" });
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
                .json({ message: "Пользователь с таким email уже существует" });
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
                .json({ message: "Произошла ошибка при создании пользователя" });
        }
        const localCommand = await prisma_client_1.default.command.create({
            data: {
                name: `Личное`,
                description: `Это ваша локальная команда, здесь находятся все ваши личные задачи. Локальную команду нельзя удалить, в нее нельзя добавлять других пользователей.`,
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
        return res.status(400).json({ message: "Ошибка в создании пользователя" });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: "Что-то пошло не так" });
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
            return res.status(201).json({ message: "Успешно изменено" });
        }
        return res.status(500).json({ message: "Пользователь не найден" });
    }
    catch {
        res
            .status(500)
            .json({ message: "Произошла ошибка при обновлении данных пользователя" });
    }
};
exports.updateUser = updateUser;

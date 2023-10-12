import { Router, IRouter } from "express";
import { Route } from "../types";
import {
	current,
	getUserWithId,
	getUserWithName,
	login,
	register,
	updateImageUser,
	updateUser,
} from "../controllers/users";
import { auth } from "../mdidleware/auth";

const router = Router();

router.post("/login", login);

router.post("/register", register);

router.get("/current", auth, current);

router.put("/update", auth, updateUser);

router.put("/updateImage", auth, updateImageUser);

router.get("/getWithId", auth, getUserWithId);

router.get("/getWithName", auth, getUserWithName);

export default router;

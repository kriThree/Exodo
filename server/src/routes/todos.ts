import { Router } from "express";

import {
	getTodos,
	addTodo,
	removeTodo,
	successTodo,
	updateTodo,
} from "../controllers/todos";
import { auth } from "../mdidleware/auth";


const router = Router();

router.use(auth);

router.get("/getAll", getTodos);

router.post("/add", addTodo);


router.delete("/remove", removeTodo);

router.delete("/success", successTodo);

router.put("/update", updateTodo);

export default router;

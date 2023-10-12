import { Router } from "express";
import {
	addCommand,
	getAllCommands,
	getAllUsersAndInvitesFromCommand,
	getCommandWithId,
	inviteUserCommand,
	leaveFromCommand,
	removeCommand,
	updateCommand,
} from "../controllers/commands";
import { auth } from "../mdidleware/auth";
const router = Router();

router.use(auth);

router.post("/add", addCommand);

router.get("/", getCommandWithId);

router.get("/getAll", getAllCommands);

router.post("/invite", inviteUserCommand);

router.put("/update", updateCommand);

router.delete("/remove", removeCommand);

router.post("/leave", leaveFromCommand);

router.get("/getUsers", getAllUsersAndInvitesFromCommand);

export default router;

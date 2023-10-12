import { Router } from "express";
import { auth } from "../mdidleware/auth";
import {
	acceptInvite,
	getAllNotifications,
	closeDaily,
	rejectInivite,
	isInvited,
} from "../controllers/notifications";

const router = Router();
router.use(auth);

router.get("/getAll", getAllNotifications);

router.post("/rejectInvite", rejectInivite);

router.post("/acceptInvite", acceptInvite);

router.post("/closeDaily", closeDaily);

router.get("/isInvited", isInvited);

export default router;

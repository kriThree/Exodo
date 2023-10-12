import cors from "cors";
import express, { json, urlencoded } from "express";
import helmet from "helmet";

import { developmentConfig, productionConfig } from "./config/index";
import userRouter from "./routes/users";
import todorRouter from "./routes/todos";
import commandRouter from "./routes/commands";
import notificationRouter from "./routes/notifications";

const isProduction = process.env.NODE_ENV === "production";

let config;

if (isProduction) {
	config = productionConfig;
} else {
	config = developmentConfig;
}

const app = express();

app.use(helmet());
app.use(
	cors({

		origin: "*"
	})
);
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/todo", todorRouter);
app.use("/command", commandRouter);
app.use("/notification", notificationRouter);
app.use("*", (req, res) => {
	console.log(req.path);
	
	res.status(200).send("Success");
});

app.listen(config.port, async () => {
	try {
		console.log("🚀 Server ready to handle requests");
	} catch (e) {
		console.log(e);
	}
});

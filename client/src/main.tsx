import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "./components/Router/Router";
import store from "./app/store";
import { Provider } from "react-redux";
import Auth from "./features/auth/Auth";
import ModalActivity from "./components/ModalActivity/ModalActivity";
import ErrorMessage from "./components/error-message/ErrorMessage";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ModalActivity>
				<Auth>
					<ErrorMessage />
					<Router />
				</Auth>
			</ModalActivity>
		</Provider>
	</React.StrictMode>
);

import styles from "./login.module.css";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { isErrorWithMessage } from "../../../../utils/isErrorWithMessagge";
import { UserLoginData, useLoginMutation } from "../../../../app/services/auth";
import { AuthLogo } from "../authLogo/AuthLogo";
import { AuthInput } from "../authInput/AuthInput";
import { AuthButton } from "../authButton/AuthButton";
import { quotes, useQuotes } from "./useQuotes";
import { useAppDispatch } from "../../../../app/hooks/hook";
import { setErrorActivity } from "../../../../features/appTools/AppTools";
import { IErrorMessage } from "../../../../types";
import { screenPaths } from "../../../../app/paths";

export const Login = (): JSX.Element => {
	const [loginUser, loginUserResult] = useLoginMutation();
	const [error, setError] = useState("");
	const dispatch = useAppDispatch();

	const [[quotesContainer, quotesScroll], quotesChildren] = useQuotes(styles);

	const [form, setForm] = useState<UserLoginData>({
		password: "",
		email: "",
	});
	const navigate = useNavigate();

	const onLogin = async () => {
		await loginUser(form)
			.unwrap()
			.then(() => navigate("/"))
			.catch((e: IErrorMessage) =>
				dispatch(setErrorActivity(e.data.message || "Error"))
			);
	};

	return (
		<div className={styles.screen}>
			<div className={styles.container}>
				<AuthLogo />
				<div className={styles.quotes} ref={quotesContainer}>
					<div ref={quotesScroll} className={styles.quotesScroll}>
						{quotesChildren}
					</div>
				</div>
				<form className={styles.inputs}>
					<AuthInput
						setState={setForm}
						type="email"
						text="Email"
						field="email"
					/>
					<AuthInput
						setState={setForm}
						type="password"
						text="Password(vEry security)"
						field="password"
					/>
					<AuthButton
						className={styles.signInButton}
						onClickAnyAction={onLogin}
					>
						Go
					</AuthButton>
				</form>

				<div className={styles.forget}>
					bro did you forget your password?
					<span className={styles.link}> You here</span>
				</div>
				<div className={styles.registration}>
					Don't have a profile yet?{" "}
					<span
						className={styles.registration__link}
						onClick={() => navigate(screenPaths.registration)}
					>
						Click
					</span>
				</div>
			</div>
		</div>
	);
};

import styles from "./register.module.css";

import { AuthLogo } from "../authLogo/AuthLogo";
import { AuthInput } from "../authInput/AuthInput";
import { AuthButton } from "../authButton/AuthButton";
import { useState } from "react";
import {
	UserRegisterData,
	useRegisterMutation,
} from "../../../../app/services/auth";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../error-message/ErrorMessage";
import { useAppDispatch } from "../../../../app/hooks/hook";
import { setErrorActivity } from "../../../../features/appTools/AppTools";
import { IErrorMessage } from "../../../../types";
import { screenPaths } from "../../../../app/paths";
export const Register = (): JSX.Element => {
	const [form, setForm] = useState<UserRegisterData>({
		password: "",
		email: "",
		name: "",
	});
	const [error, setError] = useState("");
	const [registerUser] = useRegisterMutation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const onRegister = async () => {
		await registerUser(form)
			.unwrap()
			.catch((e: IErrorMessage) => {
				dispatch(setErrorActivity(e.data.message || "error"));
				navigate("/");
			});
	};

	return (
		<div className={styles.screen}>
			<div className={styles.container}>
				<AuthLogo />
				<div className={styles.inputs}>
					<AuthInput text="Name" type="text" setState={setForm} field="name" />
					<AuthInput
						text="Email"
						type="email"
						setState={setForm}
						field="email"
					/>
					<AuthInput
						text="Password"
						type="text"
						setState={setForm}
						field="password"
					/>
					<AuthButton
						className={styles.signUpButton}
						onClickAnyAction={onRegister}
					>
						register
					</AuthButton>
				</div>

				<div className={styles.already}>
					you are already registered?
					<span
						className={styles.link}
						onClick={() => navigate(screenPaths.login)}
					>
						{" "}
						You here
					</span>
				</div>
				<ErrorMessage />
			</div>
		</div>
	);
};

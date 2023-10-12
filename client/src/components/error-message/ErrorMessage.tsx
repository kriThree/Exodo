import { FC, useEffect, useMemo } from "react";
import styles from "./errorMessage.module.css";
import { useDispatch } from "react-redux";
import { setErrorActivity } from "../../features/appTools/AppTools";
import { useAppSelector } from "../../app/hooks/hook";

const ErrorMessage: FC = ({}) => {
	const dispatch = useDispatch();
	const message = useAppSelector((state) => state.appTools.errorActivity);
	useEffect(() => {
		setTimeout(() => {
			dispatch(setErrorActivity(""));
		}, 5000);
	}, [message]);
	return (
		<div
			className={`${styles.modal__error} ${
				message ? styles.modal__error_active : ""
			}`}
		>
			{message}
		</div>
	);
};

export default ErrorMessage;

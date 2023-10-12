import { Children, Dispatch } from "react";
import styles from "./authButton.module.css";
import { useDispatch } from "react-redux";
import { AnyAction } from "@reduxjs/toolkit";

export const AuthButton = ({
	children,
	className,
	onClickAnyAction,
}: {
	className: string;
	children?: string;
	onClickAnyAction: Function;
}): JSX.Element => {

	return (
		<button
			className={`${styles.button} ${className}`}
			onClick={(e) => {
				e.preventDefault();
				onClickAnyAction()
			}}
		>
			{children}
		</button>
	);
};

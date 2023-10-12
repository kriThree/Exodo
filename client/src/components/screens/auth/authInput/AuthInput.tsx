import { Dispatch } from "react";
import styles from "./authInput.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "@reduxjs/toolkit";
export const AuthInput = <DispatchType,>({
	setState,
	type,
	text,
	field,
}: {
	setState: Function;
	type: string;
	text: string;
	field: string;
}): JSX.Element => {
	const dispatch = useDispatch();

	return (
		<div className={styles.block}>
			<label className={styles.label} htmlFor={text}>
				{text}
			</label>
			<input
				type={type}
				className={styles.input}
				id={text}
				onChange={(e) =>
					setState((prev: { [key: string]: any }) => {
						prev[field] = e.target.value;
						return prev;
					})
				}
			/>
		</div>
	);
};

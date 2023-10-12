import { Dispatch, SetStateAction } from "react";
import styles from "./field.module.css";

export const Field = ({
	label,
	state,
	setState,
	classNames,
	canChange,
	setCanChange,
}: {
	classNames?: {
		field?: string;
		input?: string;
		label?: string;
	};
	label?: string;
	state: string;
	setState: (str: string) => void;
	canChange: boolean;
	setCanChange: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
	return (
		<div
			className={`${styles.field} ${classNames?.field || ""} ${
				!canChange && styles.field_active
			}`}
		>
			{label ? (
				<div className={`${styles.label} ${classNames?.label || ""}`}>
					{label}:
				</div>
			) : (
				""
			)}

			<input
				name={label || ""}
				className={`${styles.input} ${classNames?.input || ""}`}
				value={state}
				onChange={(e) => setState(e.target.value)}
				disabled={!canChange}
			/>
			<button
				className={styles.change}
				onClick={() => setCanChange((prev) => !prev)}
			>
				<img src="/images/pencil.svg" alt="change" />
			</button>
		</div>
	);
};

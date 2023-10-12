import { FC } from "react";
import styles from "./ButtonsChoice.module.css";
interface IButtonsChoice {
	confirm: () => void;
	cancel: () => void;
	className?: string;
}

const ButtonsChoice: FC<IButtonsChoice> = ({ confirm, cancel, className }) => {
	return (
		<div className={`${styles.buttons} ${className}`}>
			<button
				className={`${styles.confirm} ${styles.button}`}
				onClick={() => confirm()}
			>
				<img src="/images/cardCommand/check.svg" alt="confirm" />
			</button>
			<button
				className={`${styles.cancel} ${styles.button}`}
				onClick={() => cancel()}
			>
				<img src="/images/cardCommand/cross.svg" alt="cancel" />
			</button>
		</div>
	);
};

export default ButtonsChoice;

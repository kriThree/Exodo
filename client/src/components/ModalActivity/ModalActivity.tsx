import { FC, ReactNode, useEffect } from "react";
import { useAppSelector } from "../../app/hooks/hook";
import styles from "./ModalActivity.module.css";

interface IModalActivity {
	children: ReactNode;
}

const ModalActivity: FC<IModalActivity> = ({ children }) => {
	const isActivity = useAppSelector((state) => state.appTools.modalActivity);

	return (
		<>
			{children}
			{isActivity ? <div className={styles.back__modal__black}></div> : ""}
		</>
	);
};

export default ModalActivity;

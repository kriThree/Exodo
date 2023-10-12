import { useMemo } from "react";
import styles from "../css/colors.module.css";
export const useGetRandomColor = () => {
	const color = useMemo(() => {
		return Math.ceil(Math.random() * 5);
	}, []);

	return styles["command" + color];
};

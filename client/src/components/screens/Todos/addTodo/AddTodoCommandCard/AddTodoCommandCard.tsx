import { FC, useState, useMemo } from "react";
import styles from "./addTodoCommandCard.module.css";
import { Command } from "@prisma/client";
import { useGetRandomColor } from "../../../../../hooks/useGetRandomColor";

interface ICommand {
	command: Command;
	setSelectCommand: (e: string) => void;
	selectCommand: string;
}

const AddTodoCommandCard: FC<ICommand> = ({
	command,
	selectCommand,
	setSelectCommand,
}) => {
	const [active, setActive] = useState(false);
	const color = useGetRandomColor();

	return (
		<div
			className={`${styles.command} ${
				!command.isLocal ? color : ""
			} ${selectCommand === command.id ? styles.command_select : ""}`}
			onClick={() => setSelectCommand(command.id)}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
		>
			{command.isLocal ? (
				<img src="/images/todos/add-todo/add-todo-user.svg" alt="user" />
			) : (
				""
			)}
			<div
				className={`${styles.command__dropDownMenu} ${
					active ? styles.command__dropDownMenu_active : ""
				}`}
			>
				{command.name}
			</div>
		</div>
	);
};

export default AddTodoCommandCard;

import { Todo } from "@prisma/client";
import styles from "./todo.module.css";
import { useState } from "react";
import { useGetCommandQuery } from "../../../../app/services/commands";
import {
	useRemoveTodoMutation,
	useSuccessTodoMutation,
} from "../../../../app/services/todos";
export const TodoCard = ({
	name,
	description,
	commandId,
	id,
	tag,
}: Todo): JSX.Element => {
	const [tagActive, setTagActive] = useState<boolean>(false);
	const [commandActive, setCommandActive] = useState<boolean>(false);
	const command = useGetCommandQuery(commandId).data?.command;
	const [removeTodo] = useRemoveTodoMutation();
	const [successTodo] = useSuccessTodoMutation();

	return (
		<div className={styles.todo}>
			<div className={styles.top}>
				<div className={styles.name}>
					<h2>{name}</h2>
				</div>
				<div className={styles.description}>{description}</div>
			</div>

			<div className={styles.bottom}>
				<div>
					<div
						className={`${styles.check} ${styles.icon}`}
						onClick={() => successTodo(id)}
					>
						<img src="/public/images/todos/check.svg" alt="check" />
					</div>
					<div
						className={`${styles.cross} ${styles.icon}`}
						onClick={() => removeTodo(id)}
					>
						<img src="/public/images/todos/cross.svg" alt="cross" />
					</div>
				</div>
				<div>
					<div
						className={`${styles.tags} ${styles.icon}`}
						onMouseEnter={() => setTagActive(true)}
						onMouseLeave={() => setTagActive(false)}
					>
						<img src="/public/images/tags.svg" alt="tags" />
					</div>
					<div
						className={`${styles.todo__dropDownMenu} ${
							tagActive ? styles.todo__dropDownMenu_active : ""
						}`}
					>
						{tag}
					</div>
					<div
						className={`${styles.user} ${styles.icon}`}
						onMouseEnter={() => setCommandActive(true)}
						onMouseLeave={() => setCommandActive(false)}
					>
						<img
							src={
								command?.isLocal
									? "/public/images/todos/user.svg"
									: "/public/images/todos/command.svg"
							}
							alt="user"
						/>
					</div>
					<div
						className={`${styles.todo__dropDownMenu} ${
							commandActive ? styles.todo__dropDownMenu_active : ""
						}`}
					>
						{command && command.name}
					</div>
				</div>
			</div>
		</div>
	);
};

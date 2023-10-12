import styles from "./addtodo.module.css";
import React, { Dispatch, useState, SetStateAction, useMemo } from "react";
import { useGetAllCommandsQuery } from "../../../../app/services/commands";
import { Command } from "@prisma/client";
import { useAddTodoMutation } from "../../../../app/services/todos";
import AddTodoCommandCard from "./AddTodoCommandCard/AddTodoCommandCard";
import { useAppDispatch } from "../../../../app/hooks/hook";
import { setErrorActivity } from "../../../../features/appTools/AppTools";
import { IErrorMessage } from "../../../../types";

const  getTagClassName = (selectTag : string,tag:string,i:number) => {
	return`${styles.tag} ${
		selectTag === tag
			? `${styles.tag_active} ${
					i % 2 ? styles.tag_even : styles.tag_odd
			  }`
			: ""
	}`
}


export const AddTodo = ({
	className,
	active,
	setActive,
}: {
	setActive: (par: boolean) => void;
	className: string;
	active?: boolean;
}): JSX.Element => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const tags = ["Do not rush", "urgently", "very urgent"];

	const commands = useGetAllCommandsQuery().data?.commands;
	const [addTodo] = useAddTodoMutation();
	const dispatch = useAppDispatch();

	const [selectCommand, setSelectCommand] = useState("");
	const [selectTag, setSelectTag] = useState("Do not rush");

	const submit = () => {
		if (name && description && selectTag && selectCommand) {
			addTodo({
				name,
				description,
				tag: selectTag,
				commandId: selectCommand,
			})
				.unwrap()
				.catch((e: IErrorMessage) => {
					console.log("e", e.data.message);

					dispatch(setErrorActivity(e.data.message || "Ошибка"));
				});
			setActive(false);
			setName("");
			setDescription("");
			setSelectTag("Do not rush");
			setSelectCommand("");
		} else {
			return;
		}
	};

	return (
		<>
			<form
				className={`${styles.addTodo} ${className} ${
					active ? styles.addTodo_active : ""
				}`}
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<div className={styles.moduleContainer}>
					<div className={styles.name}>
						<label htmlFor="name" className={styles.name__label}>
							Name Todo:
						</label>
						<input
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={styles.name__input}
							placeholder="Feed kitty"
						/>
					</div>
					<div className={styles.description}>
						<label htmlFor="description" className={styles.description__label}>
							Description
						</label>
						<textarea
							id="description"
							placeholder="Feed kitty"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={styles.description__input}
						>
							{description}
						</textarea>
					</div>
					<div className={styles.tags}>
						<div className={styles.tags__image}>
							<img src="/images/todos/add-todo/add-todo-tag.svg" alt="tag" />
						</div>
						<div className={styles.tags__list}>
							{tags.map((tag, i) => (
								<li
									className={getTagClassName(selectTag,tag,i)}
									key={tag}
									onClick={() => setSelectTag(tag)}
								>
									#{tag}
								</li>
							))}
						</div>
					</div>
					<div className={styles.commands}>
						<div className={styles.commands__image}>
							<img
								src="/images/todos/add-todo/add-todo-command.svg"
								alt="tag"
							/>
						</div>
						<div className={styles.commands__list}>
							{commands && commands.length
								? commands.map((command) => (
										<AddTodoCommandCard
											key={command.id}
											command={command}
											setSelectCommand={setSelectCommand}
											selectCommand={selectCommand}
										/>
								  ))
								: ""}
						</div>
					</div>
					<div className={styles.buttons}>
						<button className={styles.button} onClick={() => submit()}>
							<img src="/images/todos/check.svg" alt="check" />
						</button>
						<button className={styles.button} onClick={() => setActive(false)}>
							<img src="/images/todos/cross.svg" alt="cross" />
						</button>
					</div>
				</div>
			</form>
			{active ? <div className={styles.back__modal__black}></div> : ""}
		</>
	);
};

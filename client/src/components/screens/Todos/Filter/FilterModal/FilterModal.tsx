import { FC, useState } from "react";
import styles from "./filterModal.module.css";
import { useGetRandomColor } from "../../../../../hooks/useGetRandomColor";
import { Command } from "@prisma/client";
import { useAppDispatch } from "../../../../../app/hooks/hook";
import { useGetAllCommandsQuery } from "../../../../../app/services/commands";
import { setFilters } from "../../../../../features/todos/TodoSlice";
import { useGetAllTodosQuery } from "../../../../../app/services/todos";

const CommandCard: FC<{
	command: Command;
	onClick: () => void;
	selectCommand: boolean;
}> = ({ command, onClick, selectCommand }) => {
	const color = useGetRandomColor();
	if (command.isLocal) return null;

	return (
		<li
			className={`${color} ${styles.command} ${
				selectCommand ? styles.command_active : ""
			} ${styles.filter__element}`}
			onClick={() => onClick()}
		>
			{command.name}
		</li>
	);
};

const FilterModal: FC<{ setActive: () => void; active: boolean }> = ({
	setActive,
	active,
}) => {
	const dispatch = useAppDispatch();

	const [commandActive, setCommandActive] = useState(false);
	const [selectCommand, setSelectCommand] = useState("");
	const [selectTag, setSelectTag] = useState("");

	const commands = useGetAllCommandsQuery().data?.commands;
	const tags = ["Do not rush", "urgently", "very urgent"];

	return (
		<div
			className={`${styles.filter__modal} ${
				active ? styles.filter__modal_active : ""
			}`}
		>
			<div className={styles.filters}>
				<div className={styles.tags}>
					<ul className={`${styles.tags__list} ${styles.filter__list}`}>
						{tags.map((tag) => (
							<li
								key={tag}
								className={`${styles.tag} ${styles.filter__element} ${
									tag === selectTag ? styles.tag_active : ""
								}`}
								onClick={() => setSelectTag(selectTag === tag ? "" : tag)}
							>
								{tag}
							</li>
						))}
					</ul>
					<div className={styles.tags__image}>
						<img src="/images/todos/filter/tags.svg" alt="" />
					</div>
				</div>
				<div className={styles.commands}>
					<ul
						className={`${styles.commands__list} ${
							commandActive ? styles.commands__list_active : ""
						} ${styles.filter__list}`}
					>
						{commands &&
							commands.map((command) => (
								<CommandCard
									key={command.id}
									selectCommand={selectCommand === command.id}
									command={command}
									onClick={() => setSelectCommand(command.id)}
								/>
							))}
					</ul>
					<div
						className={styles.tumbler}
						onClick={() => {
							setCommandActive((prev) => !prev);
						}}
					>
						<div
							className={`${styles.tumbler__circle} ${
								commandActive ? styles.tumbler__circle_active : ""
							}`}
						/>
						<div
							className={`${styles.tumbler__personal} ${styles.tumbler__element}`}
						>
							{commandActive ? (
								<img
									src="/images/todos/filter/personal_passive.svg"
									alt="personal_passive"
								/>
							) : (
								<img
									src="/images/todos/filter/personal_active.svg"
									alt="personal_active"
								/>
							)}
						</div>
						<div
							className={`${styles.tumbler__command} ${styles.tumbler__element}`}
						>
							{commandActive ? (
								<img
									src="/images/todos/filter/command_active.svg"
									alt="command_active"
								/>
							) : (
								<img
									src="/images/todos/filter/command_passive.svg"
									alt="command_passive"
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.submit__cont}>
				<div
					className={styles.reset}
					onClick={() => {
						dispatch(setFilters({ commandId: "", tag: "" }));
						setActive();
					}}
				>
					<img src="/images/todos/filter/reset.svg" alt="" />
				</div>
				<div
					className={styles.submit}
					onClick={() => {
						dispatch(
							setFilters({
								commandId: commandActive
									? selectCommand
									: commands?.filter((command) => command.isLocal)[0].id || "",
								tag: selectTag,
							})
						);
						setActive();
					}}
				>
					<img src="/images/todos/filter/submit.svg" alt="" />
				</div>
			</div>
			<div className={styles.cross}>
				<img src="/images/cross.svg" alt="cross" onClick={() => setActive()} />
			</div>
		</div>
	);
};

export default FilterModal;

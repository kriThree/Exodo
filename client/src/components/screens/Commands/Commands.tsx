import { Header } from "../../ui/Header/Header";
import styles from "./commands.module.css";
import { useState } from "react";
import { CommandItem } from "./commandItem/CommandItem";
import { useGetAllCommandsQuery } from "../../../app/services/commands";
import UserSearch from "../../ui/UserSearch/UserSearch";
import AddCommand from "./addCommand/AddComand";

export const Commands = (): JSX.Element => {
	const { data } = useGetAllCommandsQuery();
	const commands = data?.commands;
	const [commandId, setCommandId] = useState("");
	const [addCommandActive, setAddCommandActive] = useState(false);
	return (
		<div className={styles.screen}>
			<Header />
			<div className={styles.container}>
				<UserSearch commandId={commandId} setCommandId={setCommandId} />
				<div className={styles.commands}>
					<ul className={styles.commands__list}>
						{commands && commands.length > 1
							? commands.map((command) =>
									command.isLocal ? null : (
										<CommandItem
											command={command}
											key={command.id}
											setId={setCommandId}
										/>
									)
							  )
							: "you haven't added a command yet, it's time to fix that"}
					</ul>
					{addCommandActive ? (
						<AddCommand setActive={setAddCommandActive} />
					) : (
						""
					)}
					<div
						className={styles.addCommand}
						onClick={() => setAddCommandActive(true)}
					>
						{<img src="/images/commands/add-command.svg" alt="addCommand" />}
					</div>
				</div>
			</div>
		</div>
	);
};

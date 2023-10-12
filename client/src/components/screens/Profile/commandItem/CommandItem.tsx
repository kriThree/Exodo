import { Command, User } from "@prisma/client";
import styles from "./commandItem.module.css";
import {
	useGetAllCommandsQuery,
	useGetUsersFromCommandQuery,
} from "../../../../app/services/commands";
import { useState } from "react";

interface UserInCommand extends User {
	isInvited: boolean;
}

const convertType = (isInvited: boolean, user: {}): UserInCommand => {
	let c: UserInCommand = JSON.parse(JSON.stringify(user));
	c.isInvited = isInvited;
	return c;
};

export const CommandItem = ({ command }: { command: Command }): JSX.Element => {
	const { data } = useGetUsersFromCommandQuery(command.id);
	const users: UserInCommand[] | undefined = data?.users
		.map((user) => convertType(false, user))
		.concat(data.invitedUsers.map((user) => convertType(true, user)));

	return (
		<li className={styles.command}>
			<div className={styles.command__name}>{command.name}</div>
			<ul className={styles.command__users}>
				{users && users.length
					? users.map((user) => (
							<li className={styles.command__user} key={user.id}>
								{" "}
								{user.name}
							</li>
					  ))
					: ""}
			</ul>
		</li>
	);
};

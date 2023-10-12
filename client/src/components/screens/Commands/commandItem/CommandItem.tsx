import { Command, User } from "@prisma/client";
import styles from "./commandItem.module.css";
import {
	useGetAllCommandsQuery,
	useGetUsersFromCommandQuery,
} from "../../../../app/services/commands";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks/hook";
import { setModalActivity } from "../../../../features/appTools/AppTools";
import { useNavigate } from "react-router-dom";
import { screenPaths } from "../../../../app/paths";

interface UserInCommand extends User {
	isInvited: boolean;
}

const convertType = (isInvited: boolean, user: {}): UserInCommand => {
	let c: UserInCommand = JSON.parse(JSON.stringify(user));
	c.isInvited = isInvited;
	return c;
};

export const CommandItem = ({
	command,
	setId,
}: {
	command: Command;
	setId: (str: string) => void;
}): JSX.Element => {
	const { data } = useGetUsersFromCommandQuery(command.id);
	const users: UserInCommand[] | undefined = data?.users
		.map((user) => convertType(false, user))
		.concat(data.invitedUsers.map((user) => convertType(true, user)));

	const navigate = useNavigate();
	const thisUser = useAppSelector((state) => state.auth.user);

	const [usersActive, setUsersActive] = useState(false);
	const [mouseActive, setMouseActive] = useState(false);

	const CommandCardHandler = () => {
		console.log("e");

		navigate(screenPaths.commandCard + "/" + command?.id);
	};
	const onUserAddClick = () => {
		setId(command.id);
	};

	return (
		<li
			className={`${styles.command} ${
				mouseActive ? styles.command_active : ""
			}`}
		>
			<div
				className={styles.back}
				onPointerEnter={() => setMouseActive(true)}
				onPointerLeave={() => setMouseActive(false)}
				onClick={() => !command.isLocal && CommandCardHandler()}
			/>
			<div className={styles.name}>{command.name}</div>
			<div className={styles.description}>{command.description}</div>
			<div className={styles.users}>
				{users ? (
					<div
						className={`${styles.users__view} ${
							usersActive ? styles.users__view_active : ""
						}`}
					>
						{users.map((user) => (
							<div
								className={`${styles.user} ${
									user.isInvited ? styles.user_invite : ""
								}`}
								key={user.id}
							>
								<div className={styles.user__left}>
									<div className={styles.user__avatar}>
										<img
											src={`/images/avatars/${user.image}.jpg`}
											alt="avatar"
										/>
									</div>
									<div className={styles.user__name}>
										{thisUser && thisUser.id === user.id ? (
											<span className={styles.admin}>You</span>
										) : (
											user.name
										)}
									</div>
								</div>
								<div
									className={`${styles.user__role}  ${
										command.adminId === user.id ? styles.admin_image : ""
									}`}
								>
									<img
										src={`images/roles/${
											command.adminId === user.id ? "admin" : "user"
										}_commands.svg`}
										alt="role"
									/>
								</div>
							</div>
						))}
						{!command.isLocal && (
							<div className={styles.user}>
								<div className={styles.user__left}>
									<div className={styles.user__invite}>Invite a new user</div>
								</div>
								<div
									className={styles.user__role}
									onClick={() => onUserAddClick()}
								>
									<img src="/images/cardCommand/add-user.svg" alt="addUser" />
								</div>
							</div>
						)}
					</div>
				) : (
					""
				)}

				{users && users.length > 1 ? (
					<div
						className={`${styles.nextUsers} ${
							usersActive ? styles.nextUsers_active : ""
						}`}
						onClick={() => setUsersActive((prev) => !prev)}
					>
						<img src="/images/cardCommand/next-button.svg" alt="next" />
					</div>
				) : (
					""
				)}
			</div>
		</li>
	);
};

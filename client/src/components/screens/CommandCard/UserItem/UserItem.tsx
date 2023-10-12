import { FC } from "react";
import styles from "./userItem.module.css";
import { Command, User } from "@prisma/client";
interface IUserItem {
	user: User;
	thisUser: User;
	command: Command;
}

const UserItem: FC<IUserItem> = ({ user, thisUser, command }) => {
	return (
		<div className={styles.user} key={user.id}>
			<div className={styles.user__avatar}>
				<img src={`/images/avatars/${user.image}.jpg`} alt="avatar" />
			</div>
			<div className={styles.user__name}>
				{thisUser?.id === user.id ? "You" : user.name}
			</div>
			<div className={styles.user__counter}>
				<div className={styles.user__counter__success}>{user.success}</div>
				<div className={styles.user__counter__fail}>{user.fail}</div>
			</div>
			<div
				className={`${styles.user__role} ${
					user.id === command.adminId ? styles.user__role_admin : ""
				}`}
			>
				<img
					src={`/images/roles/${
						user.id === command.adminId ? "admin" : "user"
					}_cardCommand.svg`}
				/>
			</div>
		</div>
	);
};

export default UserItem;

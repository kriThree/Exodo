import { User } from "@prisma/client";
import { FC } from "react";
import styles from "./UserSearchUserItem.module.css";
import { useIsInivitedQuery } from "../../../../app/services/notifications";
import { useAppDispatch } from "../../../../app/hooks/hook";
interface IUserSearchUserCard {
	user: User;
	commandId: string;
	onClick: () => void;
}

const UserSearchUserItem: FC<IUserSearchUserCard> = ({
	user,
	commandId,
	onClick,
}) => {
	const { data } = useIsInivitedQuery({ userId: user.id, commandId });
	const isInvited = data?.isInvited;

	return (
		<div className={styles.user}>
			{user.name}
			<button
				className={`${styles.inivite} ${isInvited ? styles.invite_active : ""}`}
				disabled={isInvited}
				onClick={() => onClick()}
			>
				<img src="/images/invite.svg" alt="" />
			</button>
		</div>
	);
};

export default UserSearchUserItem;

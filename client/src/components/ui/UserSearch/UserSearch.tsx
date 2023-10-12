import { FC, useState, useEffect } from "react";
import styles from "./userSearch.module.css";
import { useGetUsersWithNameQuery } from "../../../app/services/users";
import UserSearchUserItem from "./UserSearchUserItem/UserSearchUserItem";
import { useInviteUserInCommandMutation } from "../../../app/services/commands";
import { useAppDispatch } from "../../../app/hooks/hook";
import { setModalActivity } from "../../../features/appTools/AppTools";
interface IUserSearch {
	commandId: string;
	setCommandId: (str: string) => void;
}

const UserSearch: FC<IUserSearch> = ({ commandId, setCommandId }) => {
	const [text, setText] = useState("");
	const { data } = useGetUsersWithNameQuery(text);
	const users = data?.users;
	const [inviteUser] = useInviteUserInCommandMutation();
	const dispatch = useAppDispatch();

	const removeModal = () => {
		setCommandId("");
	};
	useEffect(() => {
		dispatch(setModalActivity(!!commandId));
	}, [commandId]);
	return commandId ? (
		<div className={styles.modal}>
			<div className={styles.cross} onClick={() => removeModal()}>
				<img src="/images/cardCommand/cross.svg" alt="" />
			</div>
			<input
				type="text"
				value={text}
				className={styles.input}
				onChange={(e) => setText(e.target.value)}
				placeholder="Name user"
			/>
			<div className={styles.variants}>
				{users?.map((user) => (
					<UserSearchUserItem
						user={user}
						key={user.id}
						commandId={commandId}
						onClick={() => {
							inviteUser({ commandId: commandId, recepientId: user.id });
							removeModal();
						}}
					/>
				))}
			</div>
			<div className={styles.back} />
		</div>
	) : (
		""
	);
};

export default UserSearch;

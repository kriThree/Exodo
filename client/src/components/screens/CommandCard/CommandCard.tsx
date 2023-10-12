import { useNavigate, useParams } from "react-router-dom";
import {
	useGetCommandQuery,
	useGetUsersFromCommandQuery,
	useLeaveFromCommandMutation,
	useRemoveCommandMutation,
	useUpdateCommandMutation,
} from "../../../app/services/commands";
import { Header } from "../../ui/Header/Header";
import styles from "./commandCard.module.css";
import { useState, Dispatch, useEffect } from "react";
import UserSearch from "../../ui/UserSearch/UserSearch";
import { screenPaths } from "../../../app/paths";
import { useAppSelector } from "../../../app/hooks/hook";
import ButtonsChoice from "../../ui/buttonsChoice/ButtonsChoice";
import UserItem from "./UserItem/UserItem";
import { Field } from "../../ui/Field/Field";

export const CommandCard = (): JSX.Element => {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [updateCommand] = useUpdateCommandMutation();
	const [removeCommand] = useRemoveCommandMutation();
	const [leaveFromCommand] = useLeaveFromCommandMutation();

	const commandQuery = useGetCommandQuery(params.id || "");
	const isSuccessCommand = commandQuery.isSuccess;
	const command = commandQuery.data?.command;

	const usersQuery = useGetUsersFromCommandQuery(command?.id || "");
	const isSuccessUsers = usersQuery.isSuccess;
	const users = usersQuery.data?.users;

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [commandSearch, setCommandSearch] = useState("");
	const [canChange, setCanChange] = useState(false);

	const thisUser = useAppSelector((state) => state.auth.user);

	useEffect(() => {
		if (isSuccessCommand && isSuccessUsers && command && users) {
			console.log(command, users);
			setName(command?.name || "");
			setDescription(command?.description || "");
		}
	}, [isSuccessCommand, isSuccessUsers]);

	const updateCommandHandler = () => {
		if (command) {
			updateCommand({ name, description, commandId: command.id })
				.unwrap()
				.then(() => navigate(screenPaths.commands));
		}
	};

	const removeCommandHandler = () => {
		if (command) {
			removeCommand(command.id)
				.unwrap()
				.then(() => navigate(screenPaths.commands));
		}
	};

	const leaveFromCommandHandler = () => {
		if (command) {
			leaveFromCommand(command.id)
				.unwrap()
				.then(() => navigate(screenPaths.commands));
		}
	};

	if (command) {
		return (
			<div className={styles.screen}>
				<Header />
				<div className={styles.container}>
					<UserSearch
						commandId={commandSearch}
						setCommandId={setCommandSearch}
					/>
					<Field
						canChange={canChange}
						setCanChange={setCanChange}
						state={name}
						setState={setName}
						classNames={{
							field: styles.name,
							input: styles.name__input,
							label: styles.name__label,
						}}
					/>
					<Field
						canChange={canChange}
						setCanChange={setCanChange}
						state={description}
						setState={setDescription}
						classNames={{
							field: styles.description,
							input: styles.description__input,
							label: styles.description__label,
						}}
					/>
					<div className={styles.users}>
						<div className={styles.users__list}>
							{users &&
								thisUser &&
								users.map((user) => (
									<UserItem user={user} thisUser={thisUser} command={command} />
								))}
						</div>

						<div
							className={styles.users__add}
							onClick={() => setCommandSearch(command.id)}
						>
							<img src="/images/add-user.svg" alt="addUser" />
						</div>
					</div>
					<div className={styles.buttons}>
						<ButtonsChoice
							className={styles.buttons__left}
							confirm={updateCommandHandler}
							cancel={() => navigate(screenPaths.commands)}
						/>
						<div
							className={`${styles.remove} ${styles.button}`}
							onClick={() =>
								command.adminId === thisUser?.id
									? removeCommandHandler()
									: leaveFromCommandHandler()
							}
						>
							<img
								src={
									command.adminId === thisUser?.id
										? "/images/cardCommand/basket.svg"
										: "/images/cardCommand/logout.svg"
								}
								alt="confirm"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return <></>;
};

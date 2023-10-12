import { useAppDispatch, useAppSelector } from "../../../app/hooks/hook";
import { useGetAllCommandsQuery } from "../../../app/services/commands";
import { Header } from "../../ui/Header/Header";
import { Field } from "../../ui/Field/Field";
import styles from "./profile.module.css";
import { CommandItem } from "./commandItem/CommandItem";
import { useState } from "react";
import { useUpdateUserMutation } from "../../../app/services/users";
import ButtonsChoice from "../../ui/buttonsChoice/ButtonsChoice";
import { setErrorActivity } from "../../../features/appTools/AppTools";
import { IErrorMessage } from "../../../types";
import { useNavigate } from "react-router-dom";
import { screenPaths } from "../../../app/paths";

export const Profile = (): JSX.Element => {
	const user = useAppSelector((state) => state.auth.user);

	if (!user) return <></>;

	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);

	const data = useGetAllCommandsQuery().data;
	const commands = data?.commands;
	const [updateUser, { isLoading }] = useUpdateUserMutation();
	const [canChange, setCanChange] = useState(false);
	const disptach = useAppDispatch();
	const navigate = useNavigate();

	const updateUserHandler = () => {
		if (email && name) {
			updateUser({ email, name })
				.unwrap()
				.then(() => setCanChange(false))
				.catch((e: IErrorMessage) => {
					console.log(e);

					disptach(setErrorActivity(e?.data?.message || "Error"));
				});
		}
	};

	return (
		<div className={styles.screen}>
			<Header className={styles.header} />
			<div className={styles.container}>
				<div className={styles.avatar} onClick={() => navigate(screenPaths.images)}>
					<img src={`/images/avatars/${user.image || "1"}.jpg`} alt="avatar" />
				</div>

				<div className={styles.fields}>
					<Field
						label="Name"
						state={name}
						setState={setName}
						classNames={{
							field: styles.name,
							input: styles.name__input,
							label: styles.name__label,
						}}
						canChange={canChange}
						setCanChange={setCanChange}
					/>
					<Field
						label="Email"
						state={email}
						setState={setEmail}
						classNames={{
							field: styles.email,
							input: styles.email__input,
							label: styles.email__label,
						}}
						canChange={canChange}
						setCanChange={setCanChange}
					/>
				</div>
				<ul className={styles.commands}>
					{commands && commands.length
						? commands.map((command) => (
								<CommandItem command={command} key={command.id} />
						  ))
						: ""}
				</ul>
				<ButtonsChoice
					className={`${styles.profile__buttons} ${
						canChange ? styles.profile__buttons_active : ""
					} `}
					confirm={() => updateUserHandler()}
					cancel={() => {
						setName(user.name);
						setEmail(user.email);
						setCanChange(false);
					}}
				/>

				<div className={styles.line} />
			</div>
		</div>
	);
};

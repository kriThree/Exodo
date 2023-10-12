import { FC, useState } from "react";
import styles from "./avatars.module.css";
import { Header } from "../../ui/Header/Header";
import ButtonsChoice from "../../ui/buttonsChoice/ButtonsChoice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hook";
import { useUpdateImageMutation } from "../../../app/services/users";
import { useNavigate } from "react-router-dom";
import { screenPaths } from "../../../app/paths";
import { setErrorActivity } from "../../../features/appTools/AppTools";
import { IErrorMessage } from "../../../types";
interface IImages {}
const avatarsIndex = new Array(10).fill(1).map((_, i) => String(i + 1));
const Avatars: FC<IImages> = ({}) => {
	const user = useAppSelector((state) => state.auth.user);
	const [selectAvatar, setSelectAvatar] = useState(user?.image || "1");
	const [updateAvatar] = useUpdateImageMutation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	return (
		<div className={styles.screen}>
			<Header />
			<div className={styles.container}>
				<div className={styles.avatars__list}>
					{avatarsIndex.map((avatarIndex) => (
						<div
							key={avatarIndex}
							className={`${styles.avatar} ${
								avatarIndex === selectAvatar ? styles.avatar_select : ""
							}`}
							onClick={() => setSelectAvatar(avatarIndex)}
						>
							<img src={`/images/avatars/${avatarIndex}.jpg`} alt="" />
						</div>
					))}
				</div>
				<ButtonsChoice
					cancel={() => {
						navigate(screenPaths.profile);
					}}
					confirm={() => {
						updateAvatar(selectAvatar)
							.then(() => navigate(screenPaths.profile))
							.catch((e: IErrorMessage) =>
								dispatch(setErrorActivity(e.data.message))
							);
					}}
					className={styles.avatars__buttons}
				/>
			</div>
		</div>
	);
};

export { Avatars };

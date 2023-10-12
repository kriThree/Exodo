import { GuestButton } from "./guestButton/Button";
import { Emoji } from "../../ui/Emoji/Emoji";
import styles from "./guest.module.css";
import { RefObject, useMemo, useRef, useState, useEffect } from "react";
import { useChangeColors } from "./useChangeColors";
import { useChangeEmoji } from "../../ui/Emoji/useChangeEmoji";
import { screenPaths } from "../../../app/paths";

export const GuestScreen = (): JSX.Element => {
	const [toddlerValue, setToddlerValue] = useState<number>(0);

	const [changeColors, screen] = useChangeColors();

	const toddlerHanddler = (value: string) => {
		setToddlerValue(+value);
		changeColors(toddlerValue);
		changeEmoji(toddlerValue);
	};
	const [changeEmoji, refs] = useChangeEmoji();

	return (
		<div className={styles.screen} ref={screen}>
			<div className={`${styles.container}`}>
				<div className={styles.logo}>Exodo</div>
				<p className={styles.subtitle}>
					Simple solution to <br />
					manage your day
				</p>

				<div className={styles.toddler__cont}>
					<div className={styles.toddler__text}>change your life yourself</div>
					<input
						className={styles.toddler}
						type="range"
						onChange={(e) => {
							toddlerHanddler(e.target.value);
						}}
						value={toddlerValue}
					/>
				</div>

				<Emoji className={styles.guest__emoji} refs={refs} />

				<div className={styles.buttons}>
					<GuestButton
						text="Come in"
						path={screenPaths.login}
						className={styles.button__signIn}
					/>

					<div className={styles.line}>
						<div className={styles.line__text}>You have account?</div>
					</div>
					<GuestButton
						text="Registration"
						path={screenPaths.registration}
						className={styles.button__signUp}
					/>
				</div>
			</div>
		</div>
	);
};

import { RefObject, useMemo } from "react";
import styles from "./emoji.module.css";
import { useChangeEmoji } from "./useChangeEmoji";
// import { useChangeEmoji } from "./useChangeEmoji";
interface IEmoji {
	className: string;
	refs: (RefObject<HTMLDivElement> | null)[];
}

export const Emoji = ({ className, refs }: IEmoji): JSX.Element => {
	const [leftEye, rightEye, mouth, leftEyeClose, rightEyeClose, mouthClose] =
		refs;
	const mutateClasses = (classList: string[]): string => {
		return [
			...classList.map((e) => styles[e]),
			...classList.map((e) => styles[className + e]),
		].join(" ");
	};

	return (
		<div className={[styles.emoji, className].join(" ")}>
			<div className={mutateClasses(["eye", "eye_left"])} ref={leftEye}>
				<div
					className={mutateClasses(["eye_close", "eye_left_close"])}
					ref={leftEyeClose}
				/>
			</div>
			<div className={mutateClasses(["eye", "eye_right"])} ref={rightEye}>
				<div
					className={mutateClasses(["eye_close", "eye_right_close"])}
					ref={rightEyeClose}
				/>
			</div>
			<div className={mutateClasses(["mouth"])} ref={mouth}>
				<div className={mutateClasses(["mouth_close"])} ref={mouthClose} />
			</div>
		</div>
	);
};

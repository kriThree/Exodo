import { Notification } from "@prisma/client";
import styles from "./notificationItem.module.css";
import { useGetCommandQuery } from "../../../../app/services/commands";
import {
	useAcceptInviteMutation,
	useCloseDailyMutation,
	useRejectInviteMutation,
} from "../../../../app/services/notifications";

export const NotificationItem = ({
	notification,
}: {
	notification: Notification;
}): JSX.Element => {
	if (notification.type === "invite") {
		const { data } = useGetCommandQuery(notification.commandId);

		const command = data?.command;
		const [rejectInvite] = useRejectInviteMutation();
		const [acceptInvite] = useAcceptInviteMutation();

		return (
			<div className={`${styles.card} ${styles.invite}`}>
				<div className={styles.invite__text}>
					you are invited to the team
					<span className={styles.command}> {command ? command.name : ""}</span>
				</div>
				<div className={styles.buttons}>
					<button
						className={`${styles.invite__button}  ${styles.invite__button_join}`}
						onClick={() => acceptInvite(notification.id)}
					>
						Join
					</button>
					<button
						className={`${styles.invite__button}  ${styles.invite__button_refuse}`}
						onClick={() => rejectInvite(notification.id)}
					>
						Refuse
					</button>
				</div>
				<div
					className={styles.cross}
					onClick={() => rejectInvite(notification.id)}
				>
					<img src="/images/cross.svg" alt="" />
				</div>
			</div>
		);
	} else if (notification.type === "statistics") {
		const [closeDaily] = useCloseDailyMutation();

		return (
			<div className={`${styles.card} ${styles.stat}`}>
				<div className={styles.stat__title}>your statistics for the day</div>
				<div className={styles.stat__numbers}>
					<div className={styles.stat__numbers__success}>
						{notification.success} completed
					</div>
					<div className={styles.stat__numbers__fail}>
						{notification.fail} not done
					</div>
				</div>
				<div className={styles.emoji}>
					<img src="/images/emoji.svg" alt="#" />
				</div>
				<div className={styles.stat__total}>Not bad but you can do more!</div>
				<div
					className={styles.cross}
					onClick={() => closeDaily(notification.id)}
				>
					<img src="/images/cross.svg" alt="" />
				</div>
			</div>
		);
	}
	return <></>;
};

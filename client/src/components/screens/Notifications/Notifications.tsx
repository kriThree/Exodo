import { useGetAllNotificationsQuery } from "../../../app/services/notifications";
import { Header } from "../../ui/Header/Header";
import { NotificationItem } from "./NotificationItem/NotificationItem";
import styles from "./notifications.module.css";
import { useState, useEffect } from "react";
export const Notifications = (): JSX.Element => {
	const { data, isLoading } = useGetAllNotificationsQuery();
	const notifications = data?.notifications;
	console.log(notifications);

	return (
		<div className={styles.screen}>
			<Header />
			<div className={styles.container}>
				<div className={styles.notifications}>
					{notifications && notifications.length ? (
						notifications.map((notification) => (
							<NotificationItem
								notification={notification}
								key={notification.id}
							/>
						))
					) : (
						<div>No notifications</div>
					)}
				</div>
			</div>
		</div>
	);
};

import { useState } from "react";
import styles from "./header.module.css";
import { Link } from "react-router-dom";

export const Header = ({ className }: { className?: string }): JSX.Element => {
	const [active, setActive] = useState(false);

	return (
		<header className={`${styles.header} ${className}`}>
			<div className={styles.container}>
				<div className={styles.left}>
					{active ? (
						<nav className={styles.navbar}>
							<Link to={"/commands"}>Commands</Link>
							<Link to={"/"}>Todos</Link>
							<Link to={"/notifications"}>Notifications</Link>
							<Link to={"/profile"}>Profile</Link>
						</nav>
					) : (
						<div className={styles.burger} onClick={() => setActive((e) => !e)}>
							<div
								className={`${styles.burger__line} `}
								id={styles.burger__line1}
							/>
							<div className={styles.burger__line} id={styles.burger__line2} />
							<div className={styles.burger__line} id={styles.burger__line3} />
						</div>
					)}
				</div>
				<div className={styles.logo}>
					{active ? (
						<div
							className={styles.logo__active}
							onClick={() => setActive((prev) => !prev)}
						>
							Example <br /> <span>ToDo</span>
							<div className={styles.logo__active_line}></div>
						</div>
					) : (
						<div className={styles.logo__inactive}>Exodo</div>
					)}
				</div>
			</div>
		</header>
	);
};

import { FC, useState } from "react";
import styles from "./filter.module.css";
import FilterModal from "./FilterModal/FilterModal";

const Filter: FC = () => {
	const [modalActive, setModalActive] = useState(false);

	return (
		<div className={styles.filter}>
			<div
				className={styles.filter__image}
				onClick={() => setModalActive((prev) => !prev)}
			>
				<img src="/images/todos/filter.svg" alt="" />
			</div>
			<FilterModal
				setActive={() => setModalActive(false)}
				active={modalActive}
			/>
			{modalActive ? <div className={styles.back__modal__black}></div> : ""}
		</div>
	);
};

export default Filter;

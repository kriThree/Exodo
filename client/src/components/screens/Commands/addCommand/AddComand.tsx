import { FC, useState } from "react";
import styles from "./addComand.module.css";
import { useAddCommandMutation } from "../../../../app/services/commands";

interface IAddCommand {
	setActive: (b: boolean) => void;
}

const AddCommand: FC<IAddCommand> = ({ setActive }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const [addCommand] = useAddCommandMutation();

	const removeAddCommand = () => {
		setName("");
		setDescription("");
		setActive(false);
	};
	const addCommandHandler = () => {
		if (name && description) {
			addCommand({ name, description });
			setActive(false);
		}
	};

	return (
		<div className={styles.command}>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className={styles.name}
				placeholder="Name"
			/>
			<input
				className={styles.description}
				type="text"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
			/>
			<div className={styles.rectangle} />
			<div className={styles.buttons}>
				<button
					className={`${styles.button} ${styles.check}`}
					onClick={() => addCommandHandler()}
				>
					<img src="/images/commands/check.svg" alt="check" />
				</button>
				<button
					className={`${styles.button} ${styles.cross}`}
					onClick={() => removeAddCommand()}
				>
					<img src="/images/commands/cross.svg" alt="cross" />
				</button>
			</div>
		</div>
	);
};

export default AddCommand;

import { Header } from "../../ui/Header/Header";
import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./todos.module.css";
import { AddTodo } from "./addTodo/AddTodo";
import { useGetAllTodosQuery } from "../../../app/services/todos";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hook";
import store from "../../../app/store";
import { TodoCard } from "./TodoCard/TodoCard";
import Filter from "./Filter/Filter";

export const Todos = (): JSX.Element => {
	const filters = useAppSelector((state) => state.todo.filters);
	const { data, isLoading } = useGetAllTodosQuery(filters);
	const [active, setActive] = useState(false);
	useEffect(() => {
		console.log(filters);
	}, [filters]);
	return (
		<div className={styles.screen}>
			<Header />
			<div className={styles.container}>
				<Filter />
				<div className={styles.todos}>
					{data?.todos && data.todos.length ? (
						<>
							{data.todos.map((options) => (
								<TodoCard {...options} key={options.id} />
							))}
						</>
					) : (
						<h1>You don't have anything to do yet, it's time to fix it</h1>
					)}
				</div>

				<AddTodo
					className={styles.addTodo}
					active={active}
					setActive={setActive}
				/>
				<button
					className={styles.add}
					onClick={() => setActive((prev) => !prev)}
				>
					<img src="/images/todos/add-todo.svg" alt="Add todo" />
				</button>
			</div>
		</div>
	);
};

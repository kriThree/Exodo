import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GuestScreen } from "../screens/Guest/Guest";
import { Login } from "../screens/auth/Login/Login";
import { Register } from "../screens/auth/Register/Register";
import { Todos } from "../screens/Todos/Todos";
import { Commands } from "../screens/Commands/Commands";
import { Profile } from "../screens/Profile/Profile";
import { Notifications } from "../screens/Notifications/Notifications";
import { CommandCard } from "../screens/CommandCard/CommandCard";
import { useAppSelector } from "../../app/hooks/hook";
import { screenPaths } from "../../app/paths";
import { Avatars } from "../screens/Avatars/Avatars";
export const Router = (): JSX.Element => {
	const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

	return (
		<>
			<BrowserRouter>
				<Routes>
					{!isAuth ? (
						<>
							<Route element={<GuestScreen />} path={screenPaths.home} />
							<Route element={<Login />} path={screenPaths.login} />
							<Route element={<Register />} path={screenPaths.registration} />
						</>
					) : (
						<>
							<Route element={<Todos />} path={screenPaths.todos} />
							<Route element={<Commands />} path={screenPaths.commands} />
							<Route element={<Profile />} path={screenPaths.profile} />
							<Route
								element={<Notifications />}
								path={screenPaths.notifications}
							/>
							<Route
								element={<CommandCard />}
								path={screenPaths.commandCard + "/:id"}
							/>
							<Route element={<Avatars />} path={screenPaths.images} />
						</>
					)}
				</Routes>
			</BrowserRouter>
		</>
	);
};

import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../features/auth/AuthSlice";
import { api } from "./services/api";
import { listenerMiddleware } from "../middleware/auth";
import todoSlice from "../features/todos/TodoSlice";
import AppToolsSlice from "../features/appTools/AppTools";

const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth: AuthSlice,
		todo: todoSlice,
		appTools: AppToolsSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(api.middleware)
			.prepend(listenerMiddleware.middleware)
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

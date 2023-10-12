import { createSlice } from "@reduxjs/toolkit";
import { User } from "@prisma/client";
import { authApi } from "../../app/services/auth";
import { RootState } from "../../app/store";

interface IinitialState {
	user: (User & { token: string }) | null;
	isAuthenticated: boolean;
}
const initialState: IinitialState = {
	user: null,
	isAuthenticated: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers(builder) {
		builder.addMatcher(
			authApi.endpoints.login.matchFulfilled,
			(state, action) => {
				console.log(action.payload);

				state.user = action.payload;
				state.isAuthenticated = true;
			}
		);
		builder.addMatcher(
			authApi.endpoints.register.matchFulfilled,
			(state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
			}
		);
		builder.addMatcher(
			authApi.endpoints.current.matchFulfilled,
			(state, action) => {
				state.user = action.payload;
				state.isAuthenticated = true;
			}
		);
	},
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectIsAuntificated = (state: RootState) =>
	state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

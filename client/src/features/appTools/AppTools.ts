import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
	modalActivity: boolean;
	errorActivity: string;
}
const initialState: IinitialState = {
	modalActivity: false,
	errorActivity: "",
};

const AppTools = createSlice({
	name: "appTools",
	initialState,
	reducers: {
		setModalActivity: (state, action) => {
			state.modalActivity = action.payload;
		},
		setErrorActivity: (state, action) => {
			state.errorActivity = action.payload;
		},
	},
});
export default AppTools.reducer;
export const { setModalActivity, setErrorActivity } = AppTools.actions;

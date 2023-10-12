import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface IFilters {
	commandId: string;
	tag: string;
}

interface IinitialState {
	filters: IFilters;
}
const initialState: IinitialState = {
	filters: {
		commandId: "",
		tag: "",
	},
};

const todoSlice = createSlice({
	name: "todo",
	initialState,
	reducers: {
		setFilters: (state, action: PayloadAction<IFilters>) => {
			state.filters = action.payload;
		},
	},
});

export const { setFilters } = todoSlice.actions;
export default todoSlice.reducer;
export type { IFilters as TodosFilters };

export const apiPaths = {
	user: {
		login: "/user/login",
		register: "/user/register",
		current: "/user/current",
		update: "/user/update",
		updateImage: "/user/updateImage",
		getWithId: "/user/getWithId",
		getWithName: "/user/getWithName",
	},
	command: {
		get: "/command/",
		add: "/command/add",
		getAll: "/command/getAll",
		invite: "/command/invite",
		update: "/command/update",
		remove: "/command/remove",
		leave: "/command/leave",
		getUsers: "/command/getUsers",
	},
	notification: {
		getAll: "/notification/getAll",
		rejectInivite: "/notification/rejectInvite",
		acceptInvite: "/notification/acceptInvite",
		closeDaily: "/notification/closeDaily",
		isInvited: "/notification/isInvited",
	},
	todo: {
		add: "/todo/add",
		getAll: "/todo/getAll",
		remove: "/todo/remove",
		success: "/todo/success",
		update: "/todo/update",
	},
} as const;

export const screenPaths = {
	home: "*",
	login: "/login",
	registration: "/registration",
	todos: "*",
	profile: "/profile",
	commands: "/commands",
	commandCard: "/command",
	notifications: "/notifications",
	images: "/images",
};

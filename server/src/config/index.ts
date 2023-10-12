const baseUrl = "http://192.168.0.11";
export const developmentConfig = {
	port: 4000,
	allowedOrigin: `${baseUrl}:5173`,
};

export const productionConfig = {
	port: 4000,
	allowedOrigin: `${baseUrl}:5173`,
};
process.env.JWT_SECRET = "pWG#zXQj@6_ymI'swe1AL|}Gq!iD3K";

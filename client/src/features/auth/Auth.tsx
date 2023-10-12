import { FC, ReactNode } from "react";
import { useCurrentQuery } from "../../app/services/auth";
import Loader from "../../components/Loader/Loader";

interface Iauth {
	children: ReactNode;
}

const Auth: FC<Iauth> = ({ children }) => {
	const { isLoading } = useCurrentQuery();

	if (isLoading) {
		return <Loader />;
	}

	return children;
};

export default Auth;

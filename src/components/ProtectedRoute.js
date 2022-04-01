import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...props }) => {
	return (
		<Route>
			{() =>
				props.isLoggedIn ? <Component {...props.propsMain} /> : <Redirect to="/sign-in" />
			}
		</Route>
	);
};

export default ProtectedRoute;
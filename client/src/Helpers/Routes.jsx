import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Context from "./Context";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { contextValue } = useContext(Context);
  return (
    <Route
      {...rest}
      render={(props) =>
        contextValue.loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export const PublicRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

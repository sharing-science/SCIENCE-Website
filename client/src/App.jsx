import React, { useReducer } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import LandingPage from "./views/LandingPage";
import ContactUsPage from "./views/ContactUsPage";
import UploadFilePage from "./views/UploadFilePage";
import ProfilePage from "./views/ProfilePage";
import LoginPage from "./views/LoginPage";
import SampleContract from "./views/SampleContractPage";
import Context from "./Helpers/Context";
import { contextReducer } from "Helpers/reducers";
import { getLocalStorageObject } from "Helpers/helperFunctions";
import { PrivateRoute, PublicRoute } from "./Helpers/Routes";

const App = () => {
  const [contextValue, dispatchContextValue] = useReducer(contextReducer, {
    loggedIn: getLocalStorageObject("loggedIn"),
    web3: getLocalStorageObject("web3"),
  });

  return (
    <Context.Provider value={{ contextValue, dispatchContextValue }}>
      <Router>
        <Switch>
          {/* Private Routes */}
          <PrivateRoute exact path="/upload" component={UploadFilePage} />
          <PrivateRoute exact path="/contract" component={SampleContract} />
          <PrivateRoute exact path="/profile" component={ProfilePage} />

          {/* Public Routes */}
          <PublicRoute exact path="/login" component={LoginPage} />
          <PublicRoute exact path="/contact-us" component={ContactUsPage} />
          <PublicRoute path="/" component={LandingPage} />
        </Switch>
      </Router>
    </Context.Provider>
  );
};

export default App;

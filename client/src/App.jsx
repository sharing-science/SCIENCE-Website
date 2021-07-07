import React, { useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LandingPage from "./views/LandingPage";
import ContactUsPage from "./views/ContactUsPage";
import UploadFilePage from "./views/UploadFilePage";
import ProfilePage from "./views/ProfilePage";
import LoginPage from "./views/LoginPage";
import SampleContract from "./views/SampleContractPage";
import Context from "./Helpers/Context";
import { contextReducer } from "Helpers/reducers";
import { getLocalStorageObject } from "Helpers/helperFunctions";

const App = () => {
  const [contextValue, dispatchContextValue] = useReducer(contextReducer, {
    loggedIn: getLocalStorageObject("loggedIn"),
    web3: getLocalStorageObject("web3"),
  });

  return (
    <Context.Provider value={{ contextValue, dispatchContextValue }}>
      <Router>
        <Switch>
          <Route
            path="/login-page"
            render={(props) => <LoginPage {...props} />}
          />
          <Route
            path="/contact-us"
            render={(props) => <ContactUsPage {...props} />}
          />
          <Route
            path="/upload"
            render={(props) => <UploadFilePage {...props} />}
          />
          <Route
            path="/contract"
            render={(props) => <SampleContract {...props} />}
          />
          <Route
            path="/profile"
            render={(props) => <ProfilePage {...props} />}
          />
          <Route path="/" render={(props) => <LandingPage {...props} />} />
        </Switch>
      </Router>
    </Context.Provider>
  );
};

export default App;

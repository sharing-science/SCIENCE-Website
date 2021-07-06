import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LandingPage from "./views/LandingPage";
import RegisterPage from "./views/RegisterPage";
import ContactUsPage from "./views/ContactUsPage";
import UploadFilePage from "./views/UploadFilePage";
import ProfilePage from "./views/ProfilePage";
import LoginPage from "./views/LoginPage";
import SampleContract from "views/SampleContractPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route
          path="/register-page"
          render={(props) => <RegisterPage {...props} />}
        />
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
        <Route path="/profile" render={(props) => <ProfilePage {...props} />} />
        <Route path="/" render={(props) => <LandingPage {...props} />} />
      </Switch>
    </Router>
  );
};

export default App;

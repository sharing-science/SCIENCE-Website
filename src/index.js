import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import Landing from "views/Landing";
import LandingPage from "views/examples/LandingPage.js";
import RegisterPage from "views/examples/RegisterPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import ContactUs from "views/ContactUs";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        path="/landing-page"
        render={(props) => <LandingPage {...props} />}
      />
      <Route
        path="/register-page"
        render={(props) => <RegisterPage {...props} />}
      />
      <Route
        path="/profile-page"
        render={(props) => <ProfilePage {...props} />}
      />
      <Route
        path="/contact-us"
        render={(props) => <ContactUs {...props} />}
      />
      <Route path="/" render={(props) => <Landing {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

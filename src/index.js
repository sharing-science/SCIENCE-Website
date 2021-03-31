import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import LandingPage from "views/LandingPage";
import RegisterPage from "views/RegisterPage";
import ContactUsPage from "views/ContactUsPage";
import UploadFilePage from "views/UploadFilePage";

ReactDOM.render(
  <Router>
    <Switch>
      <Route
        path="/register-page"
        render={(props) => <RegisterPage {...props} />}
      />
      <Route path="/contact-us" render={(props) => <ContactUsPage {...props} />} />
      <Route path="/upload" render={(props) => <UploadFilePage {...props} />} />
      <Route path="/" render={(props) => <LandingPage {...props} />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

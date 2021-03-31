import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import Landing from "views/Landing";
import RegisterPage from "views/RegisterPage";
import ContactUs from "views/ContactUs";
import UploadFile from "views/UploadFile";

ReactDOM.render(
  <Router>
    <Switch>
      <Route
        path="/register-page"
        render={(props) => <RegisterPage {...props} />}
      />
      <Route path="/contact-us" render={(props) => <ContactUs {...props} />} />
      <Route path="/upload" render={(props) => <UploadFile {...props} />} />
      <Route path="/" render={(props) => <Landing {...props} />} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

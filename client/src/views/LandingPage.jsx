import React from "react";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import { Container } from "reactstrap";

const LandingPage = () => {
  return (
    <>
      <NavBar />
      <div className="wrapper index-page">
        <div className="page-header header-filter">
          <Container>
            <img
              alt="..."
              className="path"
              src={require("assets/img/path1.png").default}
            />
            <div className="content-center brand">
              <img src="https://sanfordbernsteincenter.org/sites/default/files/civicrm/persist/contribute/images/Research%20Image.jpg" alt="" />
              <h3 className="d-none d-sm-block">
                Rensselaer Polytechnic Institute
                <br />
                Research
              </h3>
            </div>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;

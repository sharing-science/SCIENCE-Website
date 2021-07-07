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
            <div className="content-center brand">
              <h1 className="h1-seo">SCIENCE Website</h1>
              <h3 className="d-none d-sm-block">
                Rensselaer Polytechnic Institute
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

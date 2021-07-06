import React, { useEffect } from "react";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";

let ps = null;

const SampleContract = () => {
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  }, []);

  const handleClick = () => {
    console.log("hello");
  };
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <div className="page-header">
          <img
            alt="..."
            className="dots"
            src={require("assets/img/dots.png").default}
          />
          <img
            alt="..."
            className="path"
            src={require("assets/img/path1.png").default}
          />
          <Container className="align-items-center">
            <Row>
              <Col lg="6" md="6">
                Example of first thing
                <br />
                <Button color="info" onClick={handleClick}>
                  Info
                </Button>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col lg="6" md="6">
                Example of Second thing
                <br />
                <Button color="info">Info</Button>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SampleContract;

import React, { useEffect } from "react";

// core components
import NavBar from "components/NavBar";
import PageHeader from "components/PageHeader";
import Footer from "components/Footer";

const LandingPage = () => {
  useEffect(() => {
    document.body.classList.toggle("index-page");
    // Specify how to clean up after this effect:
    return () => {
      document.body.classList.toggle("index-page");
    };
  }, []);
  return (
    <>
      <NavBar />
      <div className="wrapper">
        <PageHeader />
        <div className="main"></div>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;

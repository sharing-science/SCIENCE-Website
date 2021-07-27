import React, { useContext, useState, useEffect, useCallback } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardImg,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "../Helpers/Context";
import getWeb3 from "../Helpers/getWeb3";

const LoginPage = () => {
  const { contextValue, dispatchContextValue } = useContext(Context);

  const handleLogin = async () => {
    try {
      // Get network provider (typically MetaMask) and web3 instance
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts from the provider (MetaMask)
      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();

      dispatchContextValue({
        type: "login",
        payload: { accounts, networkId },
      });
    } catch (error) {
      // Catch any errors for any of the above operations
      alert(
        `Failed to load web3, accounts, or contract. Did you migrate the contract or install MetaMask? Check console for details.`
      );
      console.error(error);
    }
  };

  const handleLogout = () => {
    dispatchContextValue({
      type: "logout",
    });
  };

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="content">
            <img
              alt="..."
              className="path"
              src={require("assets/img/blob.png").default}
            />
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("assets/img/square6.png").default}
                      />
                      <CardTitle tag="h4">
                        {" "}
                        <span className="ml-3">Login</span>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter>
                      {!contextValue.loggedIn ? (
                        <Button
                          className="btn-round"
                          color="info"
                          size="lg"
                          onClick={handleLogin}
                        >
                          Login With MetaMask
                        </Button>
                      ) : (
                        <>
                          <p>
                            Your public Key is {contextValue.web3.accounts[0]}
                          </p>
                          <Button
                            className="btn-round"
                            color="info"
                            size="lg"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;

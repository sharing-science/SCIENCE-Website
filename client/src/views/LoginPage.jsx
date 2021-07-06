import React, { useState } from "react";
import getWeb3 from "../getWeb3";

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
import Context from "../Context";
import { useContext } from "react/cjs/react.production.min";

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const { context, setContext } = useContext(Context);

  const handleClick = async () => {
    const web3 = await getWeb3();
    const accounts = await this.web3.eth.getAccounts();
    const networkId = 5777;
    setContext({
      ...context,
      web3: {
        web3,
        accounts,
        networkId,
      },
    });
  };

  // useEffect(() => {
  //   document.body.classList.toggle("register-page");
  //   let key = getPublicKey();
  //   if (key) {
  //     setLoggedIn(true);
  //     setPublicKey(key);
  //   }
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     document.body.classList.toggle("register-page");
  //   };
  // }, []);

  const printContext = () => {
    console.log(context);
  };

  return (
    <>
      <NavBar />
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("assets/img/square-purple-1.png").default}
                      />
                      <CardTitle tag="h4">Login</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      {!loggedIn ? (
                        <Button
                          className="btn-round"
                          color="primary"
                          size="lg"
                          onClick={handleClick}
                        >
                          Login With MetaMask
                        </Button>
                      ) : (
                        <>
                          <p>Your public Key is </p>
                          <Button
                            className="btn-round"
                            color="primary"
                            size="lg"
                            onClick={() => {
                              localStorage.removeItem("public_key");
                              setLoggedIn(false);
                            }}
                          >
                            Logout
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Button onClick={printContext}>See Context</Button>
              </Row>
              <div className="register-bg" />
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;

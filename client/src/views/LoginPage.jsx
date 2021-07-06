import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

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
import Web3 from "web3";

let web3 = false;

const LoginPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState("");

  const handleLoggedIn = (auth) => {
    localStorage.setItem("public_key", auth);
    let key = getPublicKey();
    setLoggedIn(true);
    setPublicKey(key);
  };

  const handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`http://localhost:5000/api/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log({ response, publicAddress, signature });
        return response;
      });

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    console.log("handleSign");
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        "" // MetaMask will ignore the password argument here
      );

      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  const handleSignup = (publicAddress) =>
    fetch(`http://localhost:8000/api/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log({ response });
        return response;
      });

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    // setLoading(true);

    // Look if user with current publicAddress is already present on backend
    fetch(`http://localhost:5000/api/users?publicAddress=${publicAddress}`)
      .then((response) => response.json())
      // If yes, retrieve it. If no, create it.
      .then((users) => {
        console.log(users);
        return users.length ? users[0] : handleSignup(publicAddress);
      })
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(handleLoggedIn)
      .catch((err) => {
        window.alert(err);
        // setLoading(false);
      });
  };

  useEffect(() => {
    document.body.classList.toggle("register-page");
    let key = getPublicKey();
    if (key) {
      setLoggedIn(true);
      setPublicKey(key);
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("register-page");
    };
  }, []);

  const getPublicKey = () => {
    let key = localStorage.getItem("public_key");
    return key ? jwtDecode(key).sub.publicAddress : "";
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
                          <p>Your public Key is {publicKey}</p>
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

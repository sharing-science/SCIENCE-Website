import React, { useContext, useState, useEffect, useCallback } from "react";
import classnames from "classnames";

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
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "../Helpers/Context";
import getWeb3 from "../Helpers/getWeb3";
import ResearcherRoles from "../contracts/ResearcherRoles.json";

const LoginPage = () => {
  const { contextValue, dispatchContextValue } = useContext(Context);
  const [roleTab, setRoleTab] = useState(1);
  const [contracts, setContracts] = useState({
    researcherRoles: {},
  });
  const [role, setRole] = useState("");

  const updateRole = useCallback(
    async (instance) => {
      const _role = await instance.methods
        .getAccountRole(contextValue.web3.accounts[0])
        .call();
      setRole(_role);
    },
    [contextValue.web3.accounts]
  );
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const instance = new web3.eth.Contract(
          ResearcherRoles.abi,
          ResearcherRoles.networks[contextValue.web3.networkId] &&
            ResearcherRoles.networks[contextValue.web3.networkId].address
        );

        updateRole(instance);
        setContracts((c) => ({
          ...c,
          researcherRoles: instance,
        }));
      } catch (error) {
        console.log("Error");
      }
    };
    if (contextValue.loggedIn) init();
  }, [contextValue.loggedIn, contextValue.web3.networkId, updateRole]);

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

  const handleRoleChange = async () => {
    await contracts.researcherRoles.methods
      .changeAccountRole(roleTab)
      .send({ from: contextValue.web3.accounts[0] });
    await updateRole(contracts.researcherRoles);
  };

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
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
                      <CardTitle tag="h4">
                        {" "}
                        <span className="ml-3">Login</span>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter>
                      {!contextValue.loggedIn ? (
                        <Button
                          className="btn-round"
                          color="primary"
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
                            color="primary"
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
                {contextValue.loggedIn ? (
                  <Col className="offset-lg-0 offset-md-3" xs="12" md="6">
                    <Card className="card-register p-4">
                      <CardHeader>
                        <Nav className="nav-tabs-info" role="tablist" tabs>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: roleTab === 1,
                              })}
                              onClick={(e) => setRoleTab(1)}
                              href="#"
                            >
                              <i className="tim-icons icon-spaceship" />
                              First Role
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: roleTab === 2,
                              })}
                              onClick={(e) => setRoleTab(2)}
                              href="#"
                            >
                              <i className="tim-icons icon-settings-gear-63" />
                              Second Role
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active: roleTab === 3,
                              })}
                              onClick={(e) => setRoleTab(3)}
                              href="#"
                            >
                              <i className="tim-icons icon-bag-16" />
                              Third Role
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </CardHeader>
                      <CardBody>
                        <TabContent
                          className="tab-space"
                          activeTab={"link" + roleTab}
                        >
                          <TabPane tabId="link1">
                            <p>This is what the first role does.</p>
                          </TabPane>
                          <TabPane tabId="link2">
                            <p>This is what the second role does</p>
                          </TabPane>
                          <TabPane tabId="link3">
                            <p>This is what the third role does</p>
                          </TabPane>
                        </TabContent>
                        <Button
                          className="btn-round"
                          color="primary"
                          size="lg"
                          onClick={handleRoleChange}
                        >
                          Change Role
                        </Button>
                      </CardBody>
                      <CardFooter>Your role is {role}</CardFooter>
                    </Card>
                  </Col>
                ) : (
                  <></>
                )}
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

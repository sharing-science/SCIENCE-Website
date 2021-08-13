import React, { useState, useEffect, useContext, useCallback } from "react";
import classnames from "classnames";

// web3 imports
import Roles from "../contracts/Roles.json";
import Context from "../Helpers/Context";
import getWeb3 from "../Helpers/getWeb3";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";

const ProfilePage = () => {
  const { contextValue, dispatchContextValue } = useContext(Context);

  const [requests, setRequests] = useState();
  const [rolesList, setRolesList] = useState({
    names: [],
    encodings: [],
  });
  const [contracts, setContracts] = useState({
    Roles: {},
  });

  const [activeRole, setActiveRole] = useState("");

  const [roles, setRoles] = useState({
    names: [],
    encodings: [],
  });

  const getRequests = async () => {
    setRequests(
      await contracts.Roles.methods
        .getRequests(rolesList.encodings[rolesList.names.indexOf(activeRole)])
        .call()
    );
  };

  const handleRequestJoin = async (key) => {
    await contracts.Roles.methods
      .requestJoin(rolesList.encodings[key])
      .send({ from: contextValue.web3.accounts[0] });
  };

  const handleAcceptRequest = async (key) => {
    console.log(key);
    await contracts.Roles.methods
      .acceptRequest(rolesList.encodings[1], key)
      .send({ from: contextValue.web3.accounts[0] });
  };

  const updateRoles = useCallback(
    async (instance, { roleNames, rolesEncodings }) => {
      const _roles = await instance.methods
        .getUsersRoles(contextValue.web3.accounts[0])
        .call();
      let rolesNames = [];
      for (let i = 0; i < _roles.length; ++i) {
        if (
          _roles[i] !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          rolesNames.push(roleNames[rolesEncodings.indexOf(_roles[i])]);
        }
      }
      setRoles({
        names: rolesNames,
        encodings: _roles,
      });
    },
    [contextValue.web3.accounts]
  );

  const handleLogout = () => {
    dispatchContextValue({
      type: "logout",
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const instance = new web3.eth.Contract(
          Roles.abi,
          Roles.networks[contextValue.web3.networkId] &&
            Roles.networks[contextValue.web3.networkId].address
        );
        const roleNames = await instance.methods.getRolesNames().call();
        const rolesEncodings = await instance.methods
          .getRolesEncodings()
          .call();
        setRolesList({
          names: roleNames,
          encodings: rolesEncodings,
        });
        updateRoles(instance, { roleNames, rolesEncodings });
        setContracts((c) => ({
          ...c,
          Roles: instance,
        }));
      } catch (error) {
        console.log("Error: " + error);
      }
    };
    if (contextValue.loggedIn) init();
  }, [contextValue.loggedIn, contextValue.web3.networkId, updateRoles]);

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="content">
            <img
              alt="..."
              className="path"
              src={require("assets/img/path1.png").default}
            />
            <Container className="align-items-center">
              <Row>
                <Col className="offset-lg-0 offset-md-3" xs="12" md="6">
                  <Card className="card-register p-4">
                    <CardHeader>
                      Your public key is: {contextValue.web3.accounts[0]}
                    </CardHeader>
                    <CardBody>
                      <h3>Choose active role:</h3>
                      <h4 className="mb-4">Your roles are:</h4>
                      <Nav className="nav-pills-info nav-pills-icons" pills>
                        {roles.names.map((curr_role, key) => (
                          <NavItem size="sm" key={key}>
                            <NavLink
                              className={classnames({
                                "active show": curr_role === activeRole,
                              })}
                              onClick={() => {
                                setActiveRole(curr_role);
                              }}
                            >
                              <i className="tim-icons icon-atom" />
                              {curr_role}
                            </NavLink>
                          </NavItem>
                        ))}
                      </Nav>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="offset-lg-0 offset-md-3" xs="12" md="6">
                  <Card className="card-register p-4 h-50">
                    <Row>
                      <Col md="4">
                        <Button onClick={getRequests}>Get Requests</Button>
                      </Col>
                      {requests ? (
                        <Col>
                          <UncontrolledDropdown group>
                            <DropdownToggle
                              caret
                              color="info"
                              data-toggle="dropdown"
                            >
                              Requests
                            </DropdownToggle>
                            <DropdownMenu>
                              {requests.map((req, key) => (
                                <DropdownItem
                                  key={key}
                                  onClick={() => handleAcceptRequest(key)}
                                >
                                  {req}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </Col>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </Card>
                  <Card className="card-register p-4 h-75">
                    <h3>Request to join Role</h3>
                    <CardBody>
                      <Col>
                        <UncontrolledDropdown group>
                          <DropdownToggle
                            caret
                            color="info"
                            data-toggle="dropdown"
                          >
                            Roles
                          </DropdownToggle>
                          <DropdownMenu>
                            {rolesList.names.map((roleName, key) => (
                              <DropdownItem
                                key={key}
                                onClick={() => handleRequestJoin(key)}
                              >
                                {roleName}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs="12" md="3">
                  <Card className="card-register p-4">
                    <Button
                      className="btn-round"
                      color="info"
                      size="lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
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

export default ProfilePage;

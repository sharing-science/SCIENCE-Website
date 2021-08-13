import React, { useContext, useEffect, useState } from "react";

// reactstrap components
import {
  Button,
  Container,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";
import DataUseTeam from "../contracts/DataUseTeam.json";

const TeamPage = () => {
  // This is the context which is information distributed over the whole application
  // contextValue.loggedIn true or false
  // contextValue.web3.accounts[0], this is the address of the logged in account
  const { contextValue } = useContext(Context);
  const [contracts, setContracts] = useState({
    contract: {},
  });
  const [teamMembers, setTeamMembers] = useState([]);

  //add collaborators to the team.
  const addCollaborator = async () => {
    const c_account = document.getElementById("c_account").value;
    const c_state = document.getElementById("c_state").value;
    await contracts.contract2.methods
      .AddCollaborator(c_account, c_state)
      .send({ from: contextValue.web3.accounts[0] });
  };

  const getTeam = async () => {
    const teamCount = await contracts.contract2.methods.getTeamCount().call();
    const _teamList = [];
    for (let i = 0; i < teamCount; ++i) {
      const c_account = await contracts.contract2.methods
        .getCollaboratorAccount(i + 1)
        .call();
      const c_state = await contracts.contract2.methods
        .getCollaboratorState(i + 1)
        .call();
      const collaborator = {
        account: c_account,
        state: c_state,
      };
      _teamList.push(collaborator);
    }
    setTeamMembers(_teamList);
  };

  // This runs when the webpage opens, this will connect to web3 and get instances of the contracts
  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();

        const Contract_instance = new web3.eth.Contract(
          Covid19usecase.abi,
          Covid19usecase.networks[contextValue.web3.networkId] &&
            Covid19usecase.networks[contextValue.web3.networkId].address
        );

        const Contract_instance2 = new web3.eth.Contract(
          DataUseTeam.abi,
          DataUseTeam.networks[contextValue.web3.networkId] &&
            DataUseTeam.networks[contextValue.web3.networkId].address
        );

        setContracts((c) => ({
          ...c,
          contract: Contract_instance,
          contract2: Contract_instance2,
        }));
      } catch (error) {
        console.log("Error");
      }
    };
    init();
  }, [contextValue.web3.networkId]);

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <img
              alt="..."
              className="path"
              src={require("assets/img/waves.png").default}
            />
            <Container>
              <Row>
                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>Add Team Collaborator</CardHeader>
                    <CardBody>
                      <label className="text-left">Collaborator Account:</label>
                      <input type="text" id="c_account" name="c_account" />
                      <br></br>
                      <label className="text-left">Collaborator State:</label>
                      <input type="text" id="c_state" name="c_state" />
                      <br></br>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className="btn-round"
                        color="info"
                        onClick={addCollaborator}
                      >
                        Add
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
                <Col xs="6">
                  <Col xs="6">
                    <Card className="p-4 card-stats">
                      <CardHeader>
                        <Button onClick={getTeam}>Show Team Members</Button>
                      </CardHeader>
                      <CardBody>
                        {teamMembers.map((item, key) => (
                          <span key={key + "-clause"}>
                            <p className="text-left" key={key + "-num-Clause"}>
                              <b>{key + 1}. </b>
                              <br />
                              Member Account: {item.account}
                              <br />
                              Member State: {item.state}
                              <br />
                              {}
                            </p>
                          </span>
                        ))}
                      </CardBody>
                      <CardFooter></CardFooter>
                    </Card>
                  </Col>
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

export default TeamPage;

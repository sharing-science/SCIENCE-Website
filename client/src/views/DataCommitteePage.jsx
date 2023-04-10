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
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Context from "../Helpers/Context";
import getWeb3 from "../Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";
import DataUseTeam from "../contracts/DataUseTeam.json";

const DataCommitteePage = () => {
  // This is the context which is information distributed over the whole application
  // contextValue.loggedIn true or false
  // contextValue.web3.accounts[0], this is the address of the logged in account
  const { contextValue } = useContext(Context);

  // This is a hook of all of the contract instances
  const [contracts, setContracts] = useState({
    contract: {},
    contract2: {},
  });

  // another hook
  const [reportList, setReportList] = useState([]);

  const [state, setState] = useState("");

  const getReports = async () => {
    const reportCount = await contracts.contract.methods
      .getReportCount()
      .call();
    const _reportList = [];
    for (let i = 0; i < reportCount; ++i) {
      const reportType = await contracts.contract.methods
        .getReportType(i + 1)
        .call();
      const reportAccount = await contracts.contract.methods
        .getReportAccount(i + 1)
        .call();
      const reportReason = await contracts.contract.methods
        .getReportReason(i + 1)
        .call();
      const report = {
        reportType: reportType,
        reportAccount: reportAccount,
        reportReason: reportReason,
      };
      _reportList.push(report);
    }
    setReportList(_reportList);
  };

  const checkStatus = async () => {
    const name = await contracts.contract.methods.getStateName().call();
    setState(name);
  };

  const committeeCheck = async () => {
    const checklist = document.querySelectorAll("input[name=info]:checked");
    console.log(checklist.length);
    if (checklist.length === 5) {
      await contracts.contract.methods
        .changeState(5)
        .send({ from: contextValue.web3.accounts[0] });
      alert(
        "Contract is Active now. The user gets permission to the request Data Set."
      );
    } else {
      await contracts.contract.methods
        .changeState(6)
        .send({ from: contextValue.web3.accounts[0] });
    }
  };

  const confirmReport = async (_account) => {
    const CollaboratorCount = await contracts.contract2.methods
      .getTeamCount()
      .call();
    for (let i = 0; i < CollaboratorCount; ++i) {
      const Account = await contracts.contract2.methods
        .getCollaboratorAccount(i + 1)
        .call();
      // find id according to account
      if (Account === _account) {
        await contracts.contract2.methods
          .changeMemberState(i + 1, "Inactive")
          .send({ from: contextValue.web3.accounts[0] });
        console.log(i);
        break;
      }
    }
    //Add alert when account could not be searched!!
    //alert("Reported Account does not exist");
    //console.log(_id);
    //await contracts.contract2.methods.changeMemberState(_id+1, "Inactive").send({ from: contextValue.web3.accounts[0] });
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
              src={require("../assets/img/waves.png").default}
            />
            <Container>
              <Row>
                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <h1>Data Use Request</h1>
                      <p>
                        Check if the user request contains all the required
                        information:
                      </p>
                    </CardHeader>
                    <CardBody>
                      <div id="content">
                        <div id="checklist">
                          <div class="item">
                            <input
                              type="checkbox"
                              name="info"
                              value="title"
                              class="check"
                            />
                            <label>the project title</label>
                          </div>

                          <div class="item">
                            <input
                              type="checkbox"
                              name="info"
                              value="personnel"
                              class="check"
                            />
                            <label>names of project personnel</label>
                          </div>
                          <div class="item">
                            <input
                              type="checkbox"
                              name="info"
                              value="statement"
                              class="check"
                            />
                            <label>a non-confidential research statement</label>
                          </div>
                          <div class="item">
                            <input
                              type="checkbox"
                              name="info"
                              value="proposal"
                              class="check"
                            />
                            <label>the project proposal</label>
                          </div>
                          <div class="item">
                            <input
                              type="checkbox"
                              name="info"
                              value="level"
                              class="check"
                            />
                            <label>the requested data access level</label>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className="btn-round"
                        id="btn"
                        color="info"
                        onClick={committeeCheck}
                      >
                        Submit
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>

                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <Button onClick={getReports}>Get Reports</Button>
                    </CardHeader>
                    <CardBody>
                      {reportList.map((item, key) => (
                        <span key={key + "-clause"}>
                          <p className="text-left" key={key + "-num-Clause"}>
                            <b>{key + 1}. </b>
                            <br />
                            Report Type: {item.reportType}
                            <br />
                            Report Account: {item.reportAccount}
                            <br />
                            Report Reason: {item.reportReason}
                            <br />
                            <Button
                              onClick={async () => {
                                await confirmReport(item.reportAccount);
                              }}
                            >
                              Confirm
                            </Button>
                            {}
                          </p>
                        </span>
                      ))}
                    </CardBody>
                    <CardFooter></CardFooter>
                  </Card>
                </Col>

                <Col xs="6">
                  <Card className="p-4 card-stats">
                    <CardHeader>
                      <Button onClick={checkStatus}>Get Contract Status</Button>
                    </CardHeader>
                    <CardBody>
                      <p className="text-left">{state}</p>
                    </CardBody>
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

export default DataCommitteePage;

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
  Input,
  Row,
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";

const ReportPage = () => {
  // This is the context which is information distributed over the whole application
  // contextValue.loggedIn true or false
  // contextValue.web3.accounts[0], this is the address of the logged in account
  const { contextValue } = useContext(Context);

  const [contracts, setContracts] = useState({
    contract: {},
  });

  const submitReport = async () => {
    const _type = document.getElementById("type").value;
    const _account = document.getElementById("account").value;
    const _reason = document.getElementById("reason").value;
    await contracts.contract.methods
      .AddReport(_type, _account, _reason)
      .send({ from: contextValue.web3.accounts[0] });
    const testType = contracts.contract.methods.getReportType(0).call();
    console.log(testType);
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

        setContracts((c) => ({
          ...c,
          contract: Contract_instance,
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
              <Col xs="12" md="6">
                <Card className="p-4 card-stats">
                  <CardHeader className="report_title">Report</CardHeader>
                  <CardBody className="report">
                    <Row>
                      <Col xs="2"></Col>
                      <Col xs="8">
                        <Row className="mb-3">
                          <label className="text-left">
                            <h6>Report Type:</h6>
                          </label>
                          <Input
                            id="type"
                            type="text"
                            list="typelist"
                            placeholder="Please select the report type"
                          />
                          <datalist id="typelist">
                            　<option>unauthorized use of the Data</option>　
                            <option>
                              unauthorized access by the third party
                            </option>
                          </datalist>
                        </Row>
                        <Row className="mb-3">
                          <label className="text-left">
                            <h6>Report Account:</h6>
                          </label>
                          <Input type="text" id="account" name="account" />
                        </Row>
                        <Row>
                          <label className="text-left">
                            <h6>Report Reason:</h6>
                          </label>
                          <Input type="text" id="reason" name="reason" />
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="btn-round"
                      color="info"
                      onClick={submitReport}
                    >
                      Report
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ReportPage;

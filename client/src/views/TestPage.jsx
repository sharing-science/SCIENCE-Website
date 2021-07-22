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
  FormGroup,
  Input
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";

const TestPage = () => {
  // This is the context which is information distributed over the whole application
  // contextValue.loggedIn true or false
  // contextValue.web3.accounts[0], this is the address of the logged in account
  const { contextValue } = useContext(Context);

  // This is a hook of all of the contract instances
  const [contracts, setContracts] = useState({
    contract: {},
  });

  // another hook
  const [clauseList, setClauseList] = useState([]);

  const getClauses = async () => {
    const clauseCount = await contracts.contract.methods
      .getClauseCount()
      .call();
    const _clauseList = [];
    for (let i = 0; i < clauseCount; ++i) {
      const clause = await contracts.contract.methods.getClause(i + 1).call();
      _clauseList.push(clause);
    }
    setClauseList(_clauseList);
    // Old version of above:
    // this.state = {
    //   ...this.state,
    //   info: "hello",
    // }
  };

  const acceptClause = async (e) => {
    await contracts.contract.methods
      .acceptClause(e.target.name)
      .send({ from: contextValue.web3.accounts[0] });
  };

  const checkAccepted = async () => {
    for (let i = 0; i < clauseList.length; ++i) {
      const status = await contracts.contract.methods.getClauseStatus(i).call();
      console.log(`The Status of Clause number ${i} is ` + status);
    }
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
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <Button onClick={getClauses}>Get Clauses</Button>
                  </CardHeader>
                  <CardBody>
                    <p className="text-left">
                      <b>1. </b>
                      this is the contract name
                    </p>
                    <Button
                      className="btn-round"
                      color="primary"
                      size="lg"
                      onClick={acceptClause}
                    >
                      Accept
                    </Button>
                    <br />
                    <Button
                      className="btn-round"
                      color="info"
                      onClick={checkAccepted}
                    >
                      Check
                    </Button>
                  </CardBody>
                  <CardFooter>
                    <FormGroup>
                      <label>File Name</label>
                      <Input type="text" />
                    </FormGroup>
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

export default TestPage;

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
} from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";

const SampleContract = () => {
  const { contextValue } = useContext(Context);

  const [contracts, setContracts] = useState({
    contract: {},
  });
  const [clauseList, setClauseList] = useState([]);

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

  const getClauses = async () => {
    const clauseCount = await contracts.contract.methods.getClauseCount().call();
    const _clauseList = [];
    for (let i = 0; i < clauseCount; ++i) {
      const clause = await contracts.contract.methods.getClause(i + 1).call();
      _clauseList.push(clause);
    }
    setClauseList(_clauseList);
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
                    {clauseList.map((item, key) => (
                      <span key={key + "-clause"}>
                        <p className="text-left" key={key + "-num-Clause"}>
                          <b>{key + 1}. </b>
                          {item}
                        </p>
                        <Button
                          className="btn-round"
                          color="info"
                          size="lg"
                          name={key}
                          onClick={acceptClause}
                        >
                          Accept
                        </Button>
                      </span>
                    ))}
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="btn-round"
                      color="info"
                      onClick={checkAccepted}
                    >
                      Check
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

export default SampleContract;

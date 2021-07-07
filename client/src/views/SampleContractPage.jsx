import React, { useContext, useEffect, useState } from "react";

// reactstrap components
import { Button, Container, Row } from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";
import Covid19usecase from "../contracts/Covid19usecase.json";

const SampleContract = () => {
  const { contextValue } = useContext(Context);

  const [web3, setWeb3] = useState();
  const [contract, setContract] = useState(undefined);
  const [clauseList, setClauseList] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const _web3 = await getWeb3();
        const instance = new _web3.eth.Contract(
          Covid19usecase.abi,
          Covid19usecase.networks[contextValue.web3.networkId] &&
            Covid19usecase.networks[contextValue.web3.networkId].address
        );

        setWeb3(_web3);
        setContract(instance);
      } catch (error) {
        console.log("Error");
      }
    };
    init();
  }, [contextValue.web3.networkId]);

  const getClauses = async () => {
    const clauseCount = await contract.methods.getClauseCount().call();
    const _clauseList = [];
    for (let i = 0; i < clauseCount; ++i) {
      const clause = await contract.methods.getClause(i + 1).call();
      _clauseList.push(clause);
    }
    setClauseList(_clauseList);
  };

  const acceptClause = async (e) => {
    await contract.methods
      .acceptClause(e.target.name)
      .send({ from: contextValue.web3.accounts[0] });
  };

  const checkAccepted = async () => {
    for (let i = 0; i < clauseList.length; ++i) {
      const status = await contract.methods.getClauseStatus(i).call();
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
            <Container>
              <Row className="mb-4">
                <Button onClick={getClauses}>Get Clauses</Button>
              </Row>
              <Row>
                {clauseList.map((item, key) => (
                  <span key={key + "-clause"}>
                    <p className="text-left" key={key + "-num-Clause"}>
                      <b>{key + 1}. </b>
                      {item}
                    </p>
                    <Button
                      className="btn-round"
                      color="primary"
                      size="lg"
                      name={key}
                      onClick={acceptClause}
                    >
                      Accept
                    </Button>
                  </span>
                ))}
              </Row>
              <Row>
                <Button
                  className="btn-round"
                  color="primary"
                  size="lg"
                  onClick={checkAccepted}
                >
                  Check
                </Button>
              </Row>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SampleContract;

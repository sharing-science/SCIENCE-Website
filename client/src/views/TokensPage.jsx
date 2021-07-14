import React, { useContext, useEffect, useState, useCallback } from "react";

// reactstrap components
import { Button, Container, Row, FormGroup, Input, Col } from "reactstrap";

// core components
import NavBar from "components/NavBar";
import Footer from "components/Footer";
import Context from "Helpers/Context";
import getWeb3 from "Helpers/getWeb3";

import MyToken from "../contracts/MyToken.json";
import MyTokenSale from "../contracts/MyTokenSale.json";
import KycContract from "../contracts/KycContract.json";

const SampleContract = () => {
  const { contextValue } = useContext(Context);

  const [web3, setWeb3] = useState();
  const [inputs, setInputs] = useState({
    kycAddress: "0x123",
    sendTo: "0x123",
  });
  const [myToken, setMyToken] = useState({});
  const [myTokenSale, setMyTokenSale] = useState({});
  const [kycContract, setKycContract] = useState({});
  const [userTokens, setUserTokens] = useState(0);

  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs({
      ...inputs,
      [e.target.name]: value,
    });
  };

  const handleKycSubmit = async () => {
    const { kycAddress } = inputs;
    await kycContract.methods
      .setKycCompleted(kycAddress)
      .send({ from: contextValue.web3.accounts[0] });
    alert("Account " + kycAddress + " is now whitelisted");
  };

  const updateUserTokens = useCallback(
    async (_myToken) => {
      console.log(myToken._address);
      const amount = await _myToken.methods
        .balanceOf(contextValue.web3.accounts[0])
        .call();
      setUserTokens(amount);
    },
    [contextValue.web3.accounts, myToken._address]
  );

  const handleBuyToken = async () => {
    await myTokenSale.methods
      .buyTokens(contextValue.web3.accounts[0])
      .send({ from: contextValue.web3.accounts[0], value: 1 });
  };

  const handleSendToken = async () => {
    console.log(myToken);
    console.log(inputs.sendTo);

    const answer = await myToken.methods
      .transfer(inputs.sendTo, 1)
      .send({ from: contextValue.web3.accounts[0] });
    console.log(answer);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const _web3 = await getWeb3();
        const MyToken_instance = new _web3.eth.Contract(
          MyToken.abi,
          MyToken.networks[contextValue.web3.networkId] &&
            MyToken.networks[contextValue.web3.networkId].address
        );

        const MyTokenSale_instance = new _web3.eth.Contract(
          MyTokenSale.abi,
          MyTokenSale.networks[contextValue.web3.networkId] &&
            MyTokenSale.networks[contextValue.web3.networkId].address
        );

        const kycContract_instance = new _web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[contextValue.web3.networkId] &&
            KycContract.networks[contextValue.web3.networkId].address
        );

        setWeb3(_web3);
        setMyToken(MyToken_instance);
        setMyTokenSale(MyTokenSale_instance);
        setKycContract(kycContract_instance);
        updateUserTokens(MyToken_instance);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [contextValue.web3.networkId, updateUserTokens]);

  return (
    <>
      <NavBar />
      <div className="wrapper register-page">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="content">
            <Container>
              <Row className="mb-4">
                <h1>Kudos Tokens</h1>
              </Row>
              <Row>
                <Col xs="3">
                  <Row>
                    <h2>Enable your account</h2>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label>Address to allow:</label>
                        <Input
                          name="kycAddress"
                          onChange={handleInputChange}
                          value={inputs.kycAddress}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        type="button"
                        className="btn-round"
                        color="primary"
                        onClick={handleKycSubmit}
                      >
                        Add Address to Whitelist
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col xs="1"></Col>
                <Col xs="3">
                  <Row>
                    <h2>You have {userTokens}KUD</h2>
                  </Row>
                  <Row>
                    <Button
                      type="button"
                      className="btn-round"
                      color="primary"
                      size="lg"
                      onClick={() => updateUserTokens(myToken)}
                    >
                      Update
                    </Button>
                  </Row>
                  <Row className="mt-4">
                    <Button
                      type="button"
                      className="btn-round"
                      color="primary"
                      size="lg"
                      onClick={handleBuyToken}
                    >
                      Buy Token!
                    </Button>
                  </Row>
                </Col>
                <Col xs="1"></Col>
                <Col xs="3">
                  <Row>
                    <h2>Send KUD</h2>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup>
                        <label>Send To:</label>
                        <Input
                          name="sendTo"
                          onChange={handleInputChange}
                          value={inputs.sendTo}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        type="button"
                        className="btn-round"
                        color="primary"
                        size="lg"
                        onClick={handleSendToken}
                      >
                        Send
                      </Button>
                    </Col>
                  </Row>
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

export default SampleContract;

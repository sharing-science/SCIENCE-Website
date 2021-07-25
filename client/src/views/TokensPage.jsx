import React, { useContext, useEffect, useState, useCallback } from "react";

// reactstrap components
import {
  Button,
  Container,
  Row,
  FormGroup,
  Input,
  Col,
  Card,
  CardBody,
} from "reactstrap";

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

  const [inputs, setInputs] = useState({
    kycAddress: "0x123",
    sendTo: "0x123",
  });
  const [userTokens, setUserTokens] = useState(0);
  const [contracts, setContracts] = useState({
    myToken: {},
    myTokenSale: {},
    kycContract: {},
  });

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
    await contracts.kycContract.methods
      .setKycCompleted(kycAddress)
      .send({ from: contextValue.web3.accounts[0] });
    alert("Account " + kycAddress + " is now whitelisted");
  };

  const updateUserTokens = useCallback(
    async (_myToken) => {
      const amount = await _myToken.methods
        .balanceOf(contextValue.web3.accounts[0])
        .call();
      setUserTokens(amount);
    },
    [contextValue.web3.accounts]
  );

  const handleBuyToken = async () => {
    await contracts.myTokenSale.methods
      .buyTokens(contextValue.web3.accounts[0])
      .send({ from: contextValue.web3.accounts[0], value: 1 });
    updateUserTokens(contracts.myToken);
  };

  const handleSendToken = async () => {
    await contracts.myToken.methods
      .transfer(inputs.sendTo, 1)
      .send({ from: contextValue.web3.accounts[0] });
    updateUserTokens(contracts.myToken);
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
        setContracts((c) => ({
          ...c,
          myToken: MyToken_instance,
          myTokenSale: MyTokenSale_instance,
          kycContract: kycContract_instance,
        }));
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
          <div className="content">
            <img
              alt="..."
              className="path"
              src={require("assets/img/cercuri.png").default}
            />
            <Container>
              <Row className="mb-4">
                <h1>Kudos Tokens</h1>
              </Row>
              <Row>
                <Col xs="12" lg="3">
                  <Card className="p-4">
                    <h3>Enable your account</h3>
                    <CardBody>
                      <FormGroup>
                        <label>Address to allow:</label>
                        <Input
                          name="kycAddress"
                          onChange={handleInputChange}
                          value={inputs.kycAddress}
                          type="text"
                        />
                      </FormGroup>
                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleKycSubmit}
                      >
                        Add Address to Whitelist
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="0" lg="1"></Col>
                <Col xs="12" lg="3">
                  <Card className="p-4">
                    <h2>You have {userTokens}KUD</h2>
                    <CardBody>
                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        size="lg"
                        onClick={handleBuyToken}
                      >
                        Buy Token!
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="0" lg="1"></Col>
                <Col xs="12" lg="3">
                  <Card className="p-4">
                    <h2>Send KUD</h2>
                    <CardBody>
                      <FormGroup>
                        <label>Send To:</label>
                        <Input
                          name="sendTo"
                          onChange={handleInputChange}
                          value={inputs.sendTo}
                          type="text"
                        />
                      </FormGroup>
                    </CardBody>
                    <Button
                      type="button"
                      className="btn-round"
                      color="info"
                      size="lg"
                      onClick={handleSendToken}
                    >
                      Send
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

export default SampleContract;

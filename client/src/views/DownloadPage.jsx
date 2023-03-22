import React, { useContext, useEffect, useState } from 'react'

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
} from 'reactstrap'

// core components
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Context from '../Helpers/Context'
import getWeb3 from '../Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'

import CryptoJS from 'crypto-js';
import BigNumber from 'bignumber.js';



const CreateNewFilePage = () => {

  const [hash, setHash] = useState(null);
  const [password, setPassword] = useState('');
  const [fileData, setFileData] = useState(null);
  const [isAllowed, setIsAllowed] = useState(null);
  
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3()
        const Contract_instance = new web3.eth.Contract(
          Ownership.abi,
          Ownership.networks[contextValue.web3.networkId] &&
            Ownership.networks[contextValue.web3.networkId].address,
        )

        setContracts((c) => ({
          ...c,
          contract: Contract_instance,
        }))
      } catch (error) {
        console.log('Error')
      }
    }
    init()
  }, [contextValue.web3.networkId])

  const handleHashChange = (event) => {
    setHash(event.target.value);
  };

  //When file and name completed, register file with blockchain via newFile() smart contract
  const handleSubmit = async () => {
    //Check Access
    const myBigInt = BigNumber(hash, 16);
    let access = await contracts.contract.methods.checkAccess(myBigInt, contextValue.web3.accounts[0]).send({
      from: contextValue.web3.accounts[0],
    })
    setIsAllowed(access);

    //If Access:
    if(isAllowed){
      //Get Password
      let pass = await contracts.contract.methods.getPassword(myBigInt, contextValue.web3.accounts[0]).send({
        from: contextValue.web3.accounts[0],
      })
      console.log('password:', pass); //!!!!!!!!Will have to remove this
      setPassword(pass);

      //Download
      handleDownload()
    }
  }

  //Decrypt and Download
  const handleDownload = async () => {
    const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}`);
    const encryptedData = await response.text();
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    setFileData(decryptedData);
    handleSave(); //maybe?!?!?
  };

  const handleSave = () => {
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.txt';
    link.click();
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
              src={require('../assets/img/waves.png').default}
            />
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Download</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="Get-CID">
                      <label>File Hash</label>
                      <Input type="text" value={hash} onChange={handleHashChange} />
                      </div>

                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleSubmit}
                      >
                        Download
                      </Button>
                  </CardBody>
                  <CardFooter>
                    {isAllowed === true && 'Downloading...'}
                  </CardFooter>
                </Card>
              </Col>
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default CreateNewFilePage

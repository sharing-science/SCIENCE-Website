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

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState(null);
  
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  //Calculates hash of file when uploaded and sets hash as file ID
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  //When file and name completed, register file with blockchain via newFile() smart contract
  const [isRegistered, setIsRegistered] = useState('')

  const handleSubmit = async () => {
    //Upload
    handleUpload()

    //Handle Blockchain Contract
    console.log('hash:', hash);
    const myBigInt = BigNumber(hash, 16);
    let isRegistered = await contracts.contract.methods.newFile(myBigInt, password).send({ //!!!!Will need to add a key
      from: contextValue.web3.accounts[0],
    })
    setIsRegistered(isRegistered)
  }

  //Encrypt and Upload
  const handleUpload = () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result;
      const encryptedData = CryptoJS.AES.encrypt(fileData, password);
      const formData = new FormData();
      formData.append('file', new Blob([encryptedData.toString()], { type: 'text/plain' }));
      const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setHash(result.Hash);
    };
    reader.readAsText(file);
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
                    <h1>Register and Upload New File</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="Get-Password">
                      <label>Password</label>
                      <Input type="password" value={password} onChange={handlePasswordChange} />
                      </div>

                      <div className="File-Input">
                        <label htmlFor="file-input">File Input</label>
                        <input type="file" className="form-control" id="file-input" onChange={handleFileChange} />
                      </div>

                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleSubmit}
                      >
                        Register and Upload
                      </Button>
                  </CardBody>
                  <CardFooter>
                    {isRegistered === true && hash !== '' &&
                      'Congratulations, your new file with created with the Hash ID: ' +
                        hash + 'and password: ' + password}
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

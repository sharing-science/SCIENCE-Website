import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

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

import { encrypt } from '../Helpers/cryptography';
import Pinata from '@pinata/sdk';
import fs from 'fs';



const CreateNewFilePage = () => {

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [encryptedFile, setEncrypted] = useState(null);
  const [hash, setHash] = useState('');
  
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
  };

  //When file and name completed, register file with blockchain via newFile() smart contract
  const [isRegistered, setIsRegistered] = useState('')

  function handleSubmit() {
    //Encrypt File
    // setEncrypted(encrypt(file, password));

    //Upload
    sendFileToIPFS(encryptedFile);

    //Handle Blockchain Contract
    let isRegistered =  contracts.contract.methods.newFile(hash, password).send({
      from: contextValue.web3.accounts[0],
    })
    setIsRegistered(isRegistered)
  };

  // PINATA::::
  const sendFileToIPFS = async (fileImg) => {
    if (fileImg) {
        try {
            const formData = new FormData()
            formData.append("file", fileImg)

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: `1c67a907f26962af37aa`,
                    pinata_secret_api_key: `017a8b06a8853106b51cdc7e2ee9510b99f9f64ffab8cb536b50c7d3b890bb71`,
                    "Content-Type": "multipart/form-data",
                },
            })

            setHash(resFile.data.IpfsHash)
            console.log('hash:', hash);
        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error)
        }
    }
}

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
                    <h1>Upload New File</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="Get-Password">
                      <label>Encryption Password</label>
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
                        disabled={!file || password === ''} //ADD "|| uploading"
                      >
                        Register and Upload
                      </Button>
                  </CardBody>
                  <CardFooter>
                  {hash && isRegistered && (
                    <div>
                      <p>File uploaded successfully with hash: {hash}</p>
                    </div>
                  )}
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

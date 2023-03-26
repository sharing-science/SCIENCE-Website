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
import Pinata from '@pinata/sdk';



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
    let isRegistered = await contracts.contract.methods.newFile(myBigInt, password).send({
      from: contextValue.web3.accounts[0],
    })
    setIsRegistered(isRegistered)
  }

  // PINATA::::
  const [uploading, setUploading] = useState(false);
  const handleUpload = async () => {
    try {
      setUploading(true);

      // Read the file content
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      await new Promise((resolve) => {
        fileReader.onload = resolve;
      });

      // Encrypt the file with the password
      const fileContent = new Uint8Array(fileReader.result);
      const encryptedFile = CryptoJS.AES.encrypt(fileContent, password).toString();

      // Upload the encrypted file to IPFS using Pinata
      const pinata = Pinata('bf7e53515b52c12fd824', '9c5db7703ac8cb82707ebb46684f8303c07159759ce02faef98f16ac11aa19a0');
      const result = await pinata.pinFromIPFS(encryptedFile);
      setHash(result.IpfsHash);

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
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
                        disabled={!file || !password || uploading}
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

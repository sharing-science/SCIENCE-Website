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
import NavBar from 'components/NavBar'
import Footer from 'components/Footer'
import Context from 'Helpers/Context'
import getWeb3 from 'Helpers/getWeb3'
import Ownership from '../contracts/Ownership.json'
//Specific crypto-hash
import {sha256} from 'crypto-hash';
// import {MD5} from 'crypto-js';
//import "assets/css/hashing.css"; 

import BigNumber from 'bignumber.js';



const CreateNewFilePage = () => {
  //let [file_input, setFileInput] = useState('');
  
  const { contextValue } = useContext(Context)

  const [contracts, setContracts] = useState({
    contract: {},
  })

  //const [fileID, setFileID] = useState('')
  const [hash, setHash] = useState('')

  const [inputs, setInputs] = useState({
    fileID: '',
    fileName: '',
  })

  const handleFileNameChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setInputs({
      ...inputs,
      [e.target.name]: value,
    })
  }

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

  //Calculates hash of file when uploaded and sets hash as file ID
  const handleFileInput = (e) => {
    // Initializing the file reader
    const fr = new FileReader();

    // Listening to when the file has been read.
    fr.onload = async () => {

        let result = '';

        result = await sha256(fr.result);

        // Setting the hashed text as the output
        setHash(result);
        
        //setFileID(BigNumber(hash, 16));

        // Setting the content of the file as file input
        //setFileInput(fr.result);
    }

    // Reading the file.
    fr.readAsText(e.target.files[0]);
  }

  //When file and name completed, register file with blockchain via newFile() smart contract
  const [isRegistered, setIsRegistered] = useState('')
  const handleSubmit = async () => {
    console.log('hash:', hash);
    const myBigInt = BigNumber(hash, 16);
    console.log('myBigInt:', myBigInt);
    let isRegistered = await contracts.contract.methods.newFile(myBigInt).send({
      from: contextValue.web3.accounts[0],
    })
    setIsRegistered(isRegistered)
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
              src={require('assets/img/waves.png').default}
            />
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Register New File</h1>
                  </CardHeader>
                  <CardBody>
                    <div className="Get-Name">
                      <label>File Name</label>
                      <Input
                        name="fileName"
                        onChange={handleFileNameChange}
                        value={inputs.fileName}
                        type="text"
                        color="primary"
                      />
                      </div>

                      <div className="File-Input">
                        <label htmlFor="file-input">File Input</label>
                        <input type="file" className="form-control" id="file-input" onChange={handleFileInput} />
                      </div>

                      <div className="hashed-output">
                        <h4 className="hashed-algorithm-heading">File ID</h4>
                        <div className="hashed-algorithm-container">
                          <p className="hashed-algorithm-text">
                            Your file Hash ID is: {hash}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={handleSubmit}
                      >
                        Register New File
                      </Button>
                  </CardBody>
                  <CardFooter>
                    {isRegistered === true && hash !== '' &&
                      'Congratulations, your new file with created with the Hash ID: ' +
                        hash}
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

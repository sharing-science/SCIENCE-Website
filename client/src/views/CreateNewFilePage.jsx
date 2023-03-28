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
    setEncrypted(encrypt(file, password));

    //Upload
    handleUpload();

    //Handle Blockchain Contract
    console.log('hash:', hash);
    let isRegistered =  contracts.contract.methods.newFile(hash, password).send({
      from: contextValue.web3.accounts[0],
    })
    setIsRegistered(isRegistered)
  };

  // PINATA::::
  const [uploading, setUploading] = useState(false);
  function handleUpload() {
    try {
      setUploading(true);

      // Upload the encrypted file to IPFS using Pinata
      console.log('Name:', file.name);
      console.log('1');
      const pinata = new Pinata({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZDBhNzBjMC1iYmJiLTRjNWEtYmQ4Zi1mNzUyNWI0OGEyNTkiLCJlbWFpbCI6ImpvaG4uY29oZW4ud29ya0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMWM2N2E5MDdmMjY5NjJhZjM3YWEiLCJzY29wZWRLZXlTZWNyZXQiOiIwMTdhOGIwNmE4ODUzMTA2YjUxY2RjN2UyZWU5NTEwYjk5ZjlmNjRmZmFiOGNiNTM2YjUwYzdkM2I4OTBiYjcxIiwiaWF0IjoxNjc5OTc0MzEwfQ.4ACpYrC8PJtMnF0SjPRYgawlR4Z6KHspGLSwTkUeNmc'});
      console.log('2');
      pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
      console.log('3');
      const options = {
        pinataMetadata: {
            name: file.name,
            keyvalues: {
                customKey: 'customValue',
                customKey2: 'customValue2'
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
      };
      console.log('4');
      const result = pinata.pinFileToIPFS(file, options);
      console.log('5');
      setHash(result.IpfsHash);
      console.log('6');

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // const uploadFile = async () => {
  //   const fileName = 'brvv';
  //   const filePath = 'C:\Users\John\Desktop\bruh.txt';
  //   const pinata = new Pinata({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZDBhNzBjMC1iYmJiLTRjNWEtYmQ4Zi1mNzUyNWI0OGEyNTkiLCJlbWFpbCI6ImpvaG4uY29oZW4ud29ya0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMWM2N2E5MDdmMjY5NjJhZjM3YWEiLCJzY29wZWRLZXlTZWNyZXQiOiIwMTdhOGIwNmE4ODUzMTA2YjUxY2RjN2UyZWU5NTEwYjk5ZjlmNjRmZmFiOGNiNTM2YjUwYzdkM2I4OTBiYjcxIiwiaWF0IjoxNjc5OTc0MzEwfQ.4ACpYrC8PJtMnF0SjPRYgawlR4Z6KHspGLSwTkUeNmc'});
  //   const { IpfsHash } = await pinata.pinFileToIPFS(
  //     fs.createReadStream(filePath),
  //     {
  //       pinataMetadata: {
  //         name: fileName,
  //       },
  //       pinataOptions: {
  //         cidVersion: 0,
  //       },
  //     },
  //   );
  //   return IpfsHash;
  // };

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

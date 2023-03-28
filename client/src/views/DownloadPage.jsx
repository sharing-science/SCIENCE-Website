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
import Pinata from '@pinata/sdk';
import { convertWordArrayToUint8Array } from '../Helpers/cryptography';




const DownloadPage = () => {

  const [hash, setHash] = useState("");
  const [password, setPassword] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  
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
  function handleSubmit() {
    //Get Password
    let pass = contracts.contract.methods.getPassword(hash, contextValue.web3.accounts[0]).send({
      from: contextValue.web3.accounts[0],
    })

    //If access, download
    if(pass !== ''){
      //Record Password
      setIsAllowed(true);
      console.log('password:', pass); //!!!!!!!!Will have to remove this
      setPassword(pass);
      
      //Download
      handleDownload()
    }
  };

  // PINATA::::
  const [downloading, setDownloading] = useState(false);
  function handleDownload() {
    try {
      setDownloading(true);

      //Grab file from Pinata????????
      const pinata = new Pinata({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZDBhNzBjMC1iYmJiLTRjNWEtYmQ4Zi1mNzUyNWI0OGEyNTkiLCJlbWFpbCI6ImpvaG4uY29oZW4ud29ya0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMWM2N2E5MDdmMjY5NjJhZjM3YWEiLCJzY29wZWRLZXlTZWNyZXQiOiIwMTdhOGIwNmE4ODUzMTA2YjUxY2RjN2UyZWU5NTEwYjk5ZjlmNjRmZmFiOGNiNTM2YjUwYzdkM2I4OTBiYjcxIiwiaWF0IjoxNjc5OTc0MzEwfQ.4ACpYrC8PJtMnF0SjPRYgawlR4Z6KHspGLSwTkUeNmc'});
      const file = pinata.pinByHash(hash);

      //Download
      var reader = new FileReader();
      reader.onload = () => {
        //Decrypt
        var decrypted = CryptoJS.AES.decrypt(reader.result, password);          // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array
        var fileDec = new Blob([typedArray]);                                   // Create blob from typed array

        //Download
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var filename = file.name.substr(3, file.name.length);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      };
      reader.readAsText(file);

      setDownloading(false);
    } catch (error) {
      console.error(error);
      setDownloading(false);
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
                        disabled={!hash || downloading}
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

export default DownloadPage

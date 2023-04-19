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

// import CryptoJS from 'crypto-js';
// import { convertWordArrayToUint8Array } from '../Helpers/cryptography';




const DownloadPage = () => {

  const [hash, setHash] = useState("");
  const [password, setPassword] = useState("");
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
    if(pass === "test"){
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
      try {
        const fileUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
  
        axios.get(fileUrl, { responseType: 'blob' }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'filename');
        document.body.appendChild(link);
        link.click();
        })
        .catch((error) => {
          console.error(error);
        })
      } catch (error) {
        console.error(error);
      }

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
                    {isAllowed === true && downloading === true && 'Downloading...'}
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

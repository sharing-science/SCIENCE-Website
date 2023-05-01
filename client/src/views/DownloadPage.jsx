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

import CryptoJS from 'crypto-js';
// import { convertWordArrayToUint8Array } from '../Helpers/cryptography';




const DownloadPage = () => {

  const [hash, setHash] = useState("");
  const [password, setPassword] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  const [file, setFile] = useState(null);
  
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

  const handleHashChange = (event) => {
    setHash(event.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  }

  function decrypt() {
    var reader = new FileReader();
    reader.onload = () => {
        var decrypted = CryptoJS.AES.decrypt(reader.result, password);               // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
        var typedArray = convertWordArrayToUint8Array(decrypted);               // Convert: WordArray -> typed array

        var fileDec = new Blob([typedArray]);                                   // Create blob from typed array

        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileDec);
        var filename = file.name.substr(3, file.name.length);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    reader.readAsText(file);
}

function convertWordArrayToUint8Array(wordArray) {
  var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
  var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
  var uInt8Array = new Uint8Array(length), index=0, word, i;
  for (i=0; i<length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
  }
  return uInt8Array;
}

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
  const CID = require('cids');
  const [downloading, setDownloading] = useState(false);

  async function fetchIPFSResourceFromGateway(ipfsHash) {
    const gatewayUrl = 'https://ipfs.nftstorage.link';
    const fileUrl = `${gatewayUrl}/ipfs/${ipfsHash}`;

    try {
      setDownloading(true);
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
      setDownloading(false);
    } catch (error) {
      console.error(`Error fetching IPFS resource: ${error.message}`);
      setDownloading(false);
    }
  }

  function convertToCIDv1(cidString) {
    const cid = new CID(cidString);
    const cidv1 = cid.toV1();
    const base32CidString = cidv1.toString('base32');
    return base32CidString;
  }

  function handleDownload() {
    let base32Cid = convertToCIDv1(hash);
    fetchIPFSResourceFromGateway(base32Cid);
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
                        onClick={handleDownload}
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
            <Container>
              <Col xs="6">
                <Card className="p-4 card-stats">
                  <CardHeader>
                    <h1>Decrypt File</h1>
                  </CardHeader>
                  <CardBody>

                      <div className="Get-Password">
                        <label>TESTING Password!!!!</label>
                        <Input type="password" value={password} onChange={handlePasswordChange} />
                      </div>

                      <div className="File-Input">
                        <label htmlFor="file-input">Encrypted File</label>
                        <input type="file" className="form-control" id="file-input" onChange={handleFileChange} />
                      </div>

                      <Button
                        type="button"
                        className="btn-round"
                        color="info"
                        onClick={decrypt}
                        disabled={!file || !password}
                      >
                        Decrypt
                      </Button>
                  </CardBody>
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

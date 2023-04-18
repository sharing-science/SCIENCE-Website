import React, {useState} from 'react';
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

// import CryptoJS from 'crypto-js';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function PinataUpload() {

  const [hash, setHash] = useState("")

  const handleHashChange = (event) => {
    setHash(event.target.value);
  };


  function handleDownload() {
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
                    <h1>Test Download</h1>
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
                        disabled={!hash}
                      >
                        Download
                      </Button>
                  </CardBody>
                  <CardFooter>
                    
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
export default PinataUpload;
import React, { useState } from 'react'

// reactstrap components
import {
  Button,
  Container,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
} from 'reactstrap'

// core components
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import CryptoJS from 'crypto-js';


const EnDeTest = () => {

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    console.log(password);
  };

  //Calculates hash of file when uploaded and sets hash as file ID
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  }

  function encrypt() {
    var reader = new FileReader();
    reader.onload = () => {
        var wordArray = CryptoJS.lib.WordArray.create(reader.result);           // Convert: ArrayBuffer -> WordArray
        var encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();        // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

        var fileEnc = new Blob([encrypted]);                                    // Create blob from string

        var a = document.createElement("a");
        var url = window.URL.createObjectURL(fileEnc);
        var filename = "enc." + file.name;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    reader.readAsArrayBuffer(file);
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
                    <h1>Cryptography Testing</h1>
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
                        onClick={encrypt}
                        disabled={!file || !password}
                      >
                        Encrypt
                      </Button>
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

export default EnDeTest

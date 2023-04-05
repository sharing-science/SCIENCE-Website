import React, { useState } from 'react';
import Pinata from '@pinata/sdk';
import CryptoJS from 'crypto-js';

function PinataUpload() {
  const [file, setFile] = useState(null);

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePinataUpload = async () => {
    const pinata = new Pinata({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZDBhNzBjMC1iYmJiLTRjNWEtYmQ4Zi1mNzUyNWI0OGEyNTkiLCJlbWFpbCI6ImpvaG4uY29oZW4ud29ya0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMWM2N2E5MDdmMjY5NjJhZjM3YWEiLCJzY29wZWRLZXlTZWNyZXQiOiIwMTdhOGIwNmE4ODUzMTA2YjUxY2RjN2UyZWU5NTEwYjk5ZjlmNjRmZmFiOGNiNTM2YjUwYzdkM2I4OTBiYjcxIiwiaWF0IjoxNjc5OTc0MzEwfQ.4ACpYrC8PJtMnF0SjPRYgawlR4Z6KHspGLSwTkUeNmc'});
    pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
    
    // Encrypt the file using CryptoJS
    // const fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(file);
    // fileReader.onload = async (event) => {
    //   const fileData = event.target.result;
    //   const secretKey = 'asdf';
    //   const encryptedData = CryptoJS.AES.encrypt(fileData, secretKey);
    //   const encryptedFile = new File([encryptedData], file.name, { type: file.type });

      // Upload the encrypted file to Pinata
      const formData = new FormData();
      formData.append('file', file);
      
      const options = {
        pinataMetadata: {
          name: 'bruvvv'
        }
      };

      try {
        const result = await pinata.pinFileToIPFS(formData, options);
        console.log(result);
        alert('File pinned successfully!');
      } catch (error) {
        console.log(error);
        alert('Error pinning file!');
      }
    // };
  };

  return (
    <div>
      <input type="file" onChange={handleFileInputChange} />
      <button onClick={handlePinataUpload} disabled={!file}>
        Pin to Pinata
      </button>
    </div>
  );
}

export default PinataUpload;
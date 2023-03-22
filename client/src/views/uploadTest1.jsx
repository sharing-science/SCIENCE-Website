import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function UploadPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUpload = () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result;
      const encryptedData = CryptoJS.AES.encrypt(fileData, password);
      const formData = new FormData();
      formData.append('file', new Blob([encryptedData.toString()], { type: 'text/plain' }));
      const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      setHash(result.Hash);
    };
    reader.readAsText(file);
  };

  return (
    <>
    <NavBar />
    <div>
      <h1>Upload Page</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
      </div>
      <div>
        <button onClick={handleUpload}>Upload</button>
      </div>
      {hash && (
        <div>
          <p>IPFS Hash: {hash}</p>
          <a href={`https://ipfs.infura.io/ipfs/${hash}`} target="_blank" rel="noopener noreferrer">View file on IPFS</a>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default UploadPage;

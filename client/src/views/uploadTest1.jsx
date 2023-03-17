import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { create } from 'ipfs-core';

function App() {
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEncryptFile = () => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      const password = prompt('Enter password');
      const encryptedData = CryptoJS.AES.encrypt(fileData, password).toString();
      setEncryptedFile(encryptedData);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadIpfs = async () => {
    const node = await create();
    const { cid } = await node.add(encryptedFile);
    setIpfsHash(cid.toString());
  };

  return (
    <div>
      <h1>File uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleEncryptFile} disabled={!file}>
        Encrypt file
      </button>
      <br />
      {encryptedFile && (
        <>
          <h2>Encrypted file</h2>
          <p>{encryptedFile}</p>
          <button onClick={handleUploadIpfs} disabled={!encryptedFile}>
            Upload to IPFS
          </button>
        </>
      )}
      {ipfsHash && (
        <>
          <h2>IPFS hash</h2>
          <p>{ipfsHash}</p>
        </>
      )}
    </div>
  );
}

export default App;

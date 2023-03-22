import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

function DownloadPage() {
  const [hash, setHash] = useState('');
  const [password, setPassword] = useState('');
  const [fileData, setFileData] = useState(null);

  const handleHashChange = (event) => {
    setHash(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDownload = async () => {
    const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}`);
    const encryptedData = await response.text();
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
    setFileData(decryptedData);
  };

  const handleSave = () => {
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.txt';
    link.click();
  };

  return (
    <>
    <NavBar />
    <div>
      <h1>Download Page</h1>
      <div>
        <label>
          IPFS Hash:
          <input type="text" value={hash} onChange={handleHashChange} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
      </div>
      <div>
        <button onClick={handleDownload}>Download</button>
      </div>
      {fileData && (
        <div>
          <p>Downloaded file:</p>
          <pre>{fileData}</pre>
          <button onClick={handleSave}>Save file</button>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

export default DownloadPage;

// import React, { useState } from 'react';
// import CryptoJS from 'crypto-js';
// import * as IPFS from 'ipfs-core';
// import axios from 'axios';

// function DownloadFile() {
//   const [ipfsHash, setIpfsHash] = useState('');
//   const [decryptedFile, setDecryptedFile] = useState(null);
//   const [key, setKey] = useState('');

//   const handleHashChange = (event) => {
//     setIpfsHash(event.target.value);
//   };

//   const handleKeyChange = (event) => {
//     setKey(event.target.value);
//   };

//   const handleDownloadFile = async () => {
//     const node = await IPFS.create();
//     const stream = node.cat(ipfsHash);
//     const chunks = [];
//     for await (const chunk of stream) {
//       chunks.push(chunk);
//     }
//     const encryptedData = new Uint8Array(Buffer.concat(chunks)).toString();
//     const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
//     const url = URL.createObjectURL(new Blob([decryptedData]));
//     setDecryptedFile(decryptedData);
//     axios({
//       url: url,
//       method: 'GET',
//       responseType: 'blob',
//     }).then((response) => {
//       setDecryptedFile(response.data);
//     });
//   };

//   return (
//     <div>
//       <h1>File downloader</h1>
//       <input type="text" placeholder="IPFS hash" onChange={handleHashChange} />
//       <br />
//       <input type="password" placeholder="Key" onChange={handleKeyChange} />
//       <br />
//       <button onClick={handleDownloadFile}>Download file</button>
//       {decryptedFile && (
//         <a href={URL.createObjectURL(decryptedFile)} download>
//           Downloaded file
//         </a>
//       )}
//     </div>
//   );
// }

// export default DownloadFile;

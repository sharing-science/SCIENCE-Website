import CryptoJS from 'crypto-js';

function encrypt(file, password) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = () => {
        var wordArray = CryptoJS.lib.WordArray.create(reader.result);
        var encrypted = CryptoJS.AES.encrypt(wordArray, password).toString();
        var fileEnc = new Blob([encrypted]);
  
        resolve(fileEnc);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  
  function decrypt(file, password) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = () => {
        var decrypted = CryptoJS.AES.decrypt(reader.result, password);
        var typedArray = convertWordArrayToUint8Array(decrypted);
        var fileDec = new Blob([typedArray]);
  
        resolve(fileDec);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  
  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
      index = 0,
      word,
      i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }
  

export { encrypt, decrypt, convertWordArrayToUint8Array };

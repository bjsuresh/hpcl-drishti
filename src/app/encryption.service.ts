import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AES, enc, lib, SHA256, PBKDF2 } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  constructor() {}

  encrypt(pwd: string): string {
    const bytesToBeEncrypted = enc.Utf8.parse(pwd);
    const passwordBytes = enc.Utf8.parse('Password');

    const hashedPasswordBytes = SHA256(passwordBytes);
    //console.log(this.wordArrayToUint8Array(hashedPasswordBytes));

    const bytesEncrypted = this.AES_Encrypt(
      bytesToBeEncrypted,
      hashedPasswordBytes
    );

    const encryptedResult = enc.Base64.stringify(bytesEncrypted);
    console.log('encryptedResult', encryptedResult);
    return encryptedResult;
  }

  AES_Encrypt(
    bytesToBeEncrypted: lib.WordArray,
    passwordBytes: lib.WordArray): lib.WordArray {
    const saltBytes = CryptoJS.enc.Hex.parse('0206010900030405');

    const keySize = 256 / 32; // 256 bits / 32 bits per word = 8 words
    const ivSize = 128 / 32; // 128 bits / 32 bits per word = 4 words
    const iterations = 1000;

    const keyAndIv = CryptoJS.PBKDF2(passwordBytes, saltBytes, {
      keySize: keySize,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA1,
    });
    const keyAndIv2 = CryptoJS.PBKDF2(passwordBytes, saltBytes, {
      keySize: keySize + ivSize,
      iterations: iterations,
      hasher: CryptoJS.algo.SHA1,
    });

    const key = keyAndIv.words;
    const iv = keyAndIv2.words;
    console.log(keySize, ivSize);

    const keyWordArray = CryptoJS.lib.WordArray.create(key.slice(0, keySize));
    const ivWordArray = CryptoJS.lib.WordArray.create(
      iv.slice(keySize),
      ivSize * 4
    );
    // console.log(this.wordArrayToUint8Array(keyWordArray));
    // console.log(this.wordArrayToUint8Array(ivWordArray));

    const encryptedData = CryptoJS.AES.encrypt(
      bytesToBeEncrypted,
      keyWordArray,
      {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
      }
    );

    console.log('encryptedData', encryptedData);

    return encryptedData.ciphertext;
  }

  stringToUint8Array(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8;
  }


}

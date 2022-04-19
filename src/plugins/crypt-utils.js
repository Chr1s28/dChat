import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { ethers } from "ethers"

function encrypt(publicKey, data) 
{
  // generate ephemeral keypair
  const ephemeralKeyPair = nacl.box.keyPair();

  // assemble encryption parameters - from string to UInt8
  try {
    var pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
  } catch (err) {
    throw new Error('Bad public key');
  }

  const msgParamsUInt8Array = naclUtil.decodeUTF8(data);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  // encrypt
  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey,
  );

  // handle encrypted data
  const output = {
    version: 'x25519-xsalsa20-poly1305',
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    ciphertext: naclUtil.encodeBase64(encryptedMessage),
  };
  // return encrypted msg data
  return output;
}

function stringifiableToHex(value) {
  return ethers.utils.hexlify(Buffer.from(JSON.stringify(value)));
}

export { encrypt, stringifiableToHex }
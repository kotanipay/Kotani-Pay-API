import * as crypto from 'crypto';
import * as bip39 from 'bip39-light';

import {
  privateToPublic,
  pubToAddress,
  toChecksumAddress,
} from 'ethereumjs-util';

const key_hash = 'sha256';

const trimLeading0x = (input) =>
  input.startsWith('0x') ? input.slice(2) : input;

const hexToBuffer = (input) => Buffer.from(trimLeading0x(input), 'hex');

const ensureLeading0x = (input) =>
  input.startsWith('0x') ? input : `0x${input}`;

const getPublicKey = (privateKey) => {
  let privToPubKey: string | Buffer = hexToBuffer(privateKey);
  privToPubKey = privateToPublic(privToPubKey).toString('hex');
  privToPubKey = ensureLeading0x(privToPubKey);
  if (typeof privToPubKey === 'string') {
    privToPubKey = toChecksumAddress(privToPubKey);
  }
  return privToPubKey;
};

const getAccAddress = (publicKey) => {
  let pubKeyToAddress: string | Buffer = hexToBuffer(publicKey);
  pubKeyToAddress = pubToAddress(pubKeyToAddress).toString('hex');
  pubKeyToAddress = ensureLeading0x(pubKeyToAddress);
  if (typeof pubKeyToAddress === 'string') {
    pubKeyToAddress = toChecksumAddress(pubKeyToAddress);
  }
  return pubKeyToAddress;
};

const generatePrivKey = (mnemonic: string) => {
  return bip39.mnemonicToSeedHex(mnemonic).substr(0, 64);
};

export const getPublicAddress = async (mnemonic): Promise<string> => {
  const privateKey = await generatePrivKey(mnemonic);
  return new Promise((resolve) => {
    resolve(getAccAddress(getPublicKey(privateKey)).toString());
  });
};

export const getEncryptKey = (userMSISDN) => {
  return crypto.createHash(key_hash).update(userMSISDN).digest('hex');
};

export const createcypher = async (text, userMSISDN, iv) => {
  const key = await getEncryptKey(userMSISDN);
  const cipher = crypto.createCipher('aes192', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};


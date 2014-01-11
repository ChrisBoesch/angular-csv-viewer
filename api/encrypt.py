#!/usr/bin/env python
#
# Encrypt sys.stdin
# 

import fileinput
import os.path
import logging

from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA


ROOT = os.path.dirname(__file__)
PRIV_KEY = os.path.join(ROOT, 'rsa_1024_priv.pem') 
PUB_KEY = os.path.join(ROOT, 'rsa_1024_pub.pem')


def get_key(pem_path):
  with open(pem_path) as pem:
    key = RSA.importKey(pem)
    return PKCS1_v1_5.new(key)


def encrypt(key, plain_text):
  return key.encrypt(plain_text).encode('base64')


def decrypt(key, cipher_text):
  return key.decrypt(cipher_text.decode('base64'), "")


def main():
  pub_key = get_key(PUB_KEY)
  priv_key = get_key(PRIV_KEY)
  for line in fileinput.input():
    logging.info('encrypting %r...', line)
    cipher_text = encrypt(pub_key, line.rstrip('\n'))

    logging.info('Testing cipher text...')
    plain_text = decrypt(priv_key, cipher_text)
    logging.info('%r == %r', plain_text, line.rstrip('\n'))

    print cipher_text


if __name__ == '__main__':
  logging.basicConfig(level=logging.INFO)
  main()

const { createSign, createVerify } = require('crypto');

const signMessage = (message, privateKey, digestType = 'sha256') => {
    return createSign(digestType).update(message).sign(privateKey, 'base64')
};

const verifySignature = (message, signature, publicKey, digestType = 'sha256') => {
    return createVerify(digestType).update(message).verify(publicKey, signature, 'base64')
};

module.exports = {
    signMessage,
    verifySignature
}
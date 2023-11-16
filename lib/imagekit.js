// SDK initialization
const ImageKit = require("imagekit");

const { IMAGEKIT_PUB_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL } = process.env;

module.exports = new ImageKit({
    privateKey: IMAGEKIT_PRIVATE_KEY,
    publicKey: IMAGEKIT_PUB_KEY,
    urlEndpoint: IMAGEKIT_URL,
});

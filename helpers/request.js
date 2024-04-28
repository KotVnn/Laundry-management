const axios = require('axios');
const CryptoJS = require('crypto-js');
const { read } = require('jimp');
const QRCodeReader = require('qrcode-reader');

const postReq = (payload, token) => {
  return new Promise((resolve) => {
    const FormData = require('form-data');
    let data = new FormData();
    data.append('payload', payload);
    data.append('logo', 'null');

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://vietqr.net/portal-service/v1/qr-ibft/generate',
      headers: {
        Authorization: `Bearer ${token}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((error) => {
        console.log(error.message);
        return resolve(null);
      });
  });
};
const getReq = (url) => {
  return new Promise((resolve) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url,
    };

    axios
      .request(config)
      .then((response) => {
        return resolve(response.data);
      })
      .catch((error) => {
        console.log(error.message);
        return resolve(null);
      });
  });
};

const cryptoUtils = {
  cryptojs_AES_encrypt: function (data, secretKey) {
    // Lấy ngày hiện tại
    const currentDate = new Date();
    // Tạo chuỗi định dạng YYYYMMDD
    const dateStr = `${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;
    // Chuyển đổi dữ liệu thành chuỗi JSON
    const dataStr = JSON.stringify(data);
    // Mã hóa dữ liệu bằng khóa là chuỗi kết hợp dateStr và secretKey
    const encrypted = CryptoJS.AES.encrypt(dataStr, `${dateStr}${secretKey}`);
    return encrypted.toString();
  },
  cryptojs_AES_decrypt: function (encryptedData, secretKey) {
    if (!encryptedData) {
      return null;
    }
    // Lấy ngày hiện tại
    const currentDate = new Date();
    // Tạo chuỗi định dạng YYYYMMDD
    const dateStr = `${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;
    // Giải mã dữ liệu bằng khóa là chuỗi kết hợp dateStr và secretKey
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      `${dateStr}${secretKey}`,
    );
    // Chuyển đổi dữ liệu đã giải mã thành chuỗi UTF-8
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    // Chuyển đổi chuỗi UTF-8 thành đối tượng JSON
    return JSON.parse(decryptedStr);
  },
};

const readQRCodeFromBase64 = async (base64Image) => {
  try {
    // Loại bỏ tiền tố data URL để chỉ còn base64
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // Đọc ảnh từ base64
    const image = await read(Buffer.from(base64Data, 'base64'));

    // Tạo đối tượng QRCodeReader
    const qr = new QRCodeReader();

    // Giải mã mã QR từ ảnh
    const result = await new Promise((resolve, reject) => {
      qr.callback = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };
      qr.decode(image.bitmap);
    });

    // In ra kết quả QR code
    console.log('QR Code:', result.result);
    return result.result;
  } catch (error) {
    console.error('Lỗi đọc mã QR:', error);
    return null;
  }
};

module.exports = {
  getReq,
  cryptoUtils,
  postReq,
  readQRCodeFromBase64,
};

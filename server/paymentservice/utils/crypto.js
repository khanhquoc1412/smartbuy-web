const crypto = require('crypto');
const qs = require('qs');

/**
 * Sắp xếp object theo key alphabet
 */
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  
  return sorted;
}

/**
 * Tạo secure hash cho VNPAY (SHA256)
 */
function createVnpayHash(data, secretKey) {
  // Sắp xếp params theo alphabet
  const sortedData = sortObject(data);
  
  // Tạo query string
  const signData = qs.stringify(sortedData, { encode: false });
  
  // Hash với SHA256
  const hmac = crypto.createHmac('sha256', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  return signed;
}

/**
 * Verify secure hash từ VNPAY
 */
function verifyVnpayHash(data, receivedHash, secretKey) {
  // Loại bỏ vnp_SecureHash khỏi data
  const { vnp_SecureHash, vnp_SecureHashType, ...signData } = data;
  
  // Tạo hash từ data
  const calculatedHash = createVnpayHash(signData, secretKey);
  
  // So sánh
  return calculatedHash === receivedHash;
}

/**
 * Tạo HMAC SHA256 cho MOMO
 */
function createMomoSignature(rawData, secretKey) {
  const hmac = crypto.createHmac('sha256', secretKey);
  return hmac.update(rawData).digest('hex');
}

/**
 * Verify MOMO signature
 */
function verifyMomoSignature(rawData, receivedSignature, secretKey) {
  const calculatedSignature = createMomoSignature(rawData, secretKey);
  return calculatedSignature === receivedSignature;
}

module.exports = {
  sortObject,
  createVnpayHash,
  verifyVnpayHash,
  createMomoSignature,
  verifyMomoSignature,
};
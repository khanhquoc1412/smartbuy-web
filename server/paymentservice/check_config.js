const config = require('./config/config');

console.log('--- VNPAY CONFIG CHECK ---');
console.log('TMN_CODE:', config.VNPAY.TMN_CODE ? 'LOADED (' + config.VNPAY.TMN_CODE + ')' : 'MISSING');
console.log('HASH_SECRET:', config.VNPAY.HASH_SECRET ? 'LOADED (Length: ' + config.VNPAY.HASH_SECRET.length + ')' : 'MISSING');
console.log('URL:', config.VNPAY.URL);
console.log('RETURN_URL:', config.VNPAY.RETURN_URL);
console.log('--------------------------');

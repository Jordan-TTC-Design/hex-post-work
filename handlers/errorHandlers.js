const headers = require('../header');

function allError(statusNumber,res,message) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: message,
    }),
  );
  res.end();
}
module.exports = {allError};
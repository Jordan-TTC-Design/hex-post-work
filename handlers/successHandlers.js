const headers = require('../header');

function allSuccess(statusNumber, res, message) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      message: message,
    }),
  );
  res.end();
}
function returnDataSuccess(statusNumber, res, message,data) {
  res.writeHead(statusNumber, headers);
  res.write(
    JSON.stringify({
      status: 'success',
      message: message,
      data,
    }),
  );
  res.end();
}
module.exports = { allSuccess, returnDataSuccess };

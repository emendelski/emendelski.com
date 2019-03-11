/* eslint-disable */
require('dotenv').config();

const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

let config = {};

const args = process.argv.slice(2);
const method = args[0] || 'all';

/* Should be filled before deploy */
const basicConfig = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  host: process.env.FTP_HOST,
  port: 21,
  localRoot: __dirname + '/dist',
  remoteRoot: process.env.FTP_REMOTE,
  deleteRemote: false,
};

const configInclude = {
  all: {
    include: [
      '**/*',
    ],
    exclude: [
    ]
  },
}

config = Object.assign({}, basicConfig, configInclude[method]);

// use with promises
ftpDeploy.deploy(config)
  .then((res) => {
    const response = res || '';
    console.log('⭐  Upload finished!');
  })
  .catch(err => console.log(err));

ftpDeploy.on('uploaded', function(data) {
  const count = data.transferredFileCount + '/' + data.totalFilesCount;
  console.log('◽ ', count, '-', data.filename);
});

ftpDeploy.on('upload-error', function (data) {
  console.log(data.err); // data will also include filename, relativePath, and other goodies
});

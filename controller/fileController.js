let HttpStatus = require("http-status-codes");
let AWS = require("aws-sdk");
let moment = require("moment");
//var v4 = require('aws-signature-v4');
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_MEDIA,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MEDIA,
  region: process.env.AWS_DEFAULT_REGION_MEDIA
};

const bucketName = process.env.BUCKET_MEDIA_NAME || "branchmedia";

var s3 = new AWS.S3(awsConfig);

const signedS3 = (req, res, next) => {
  //let file = req.body;
  //let paramsss = req.params;
  console.log("Peticion recibida ::::>", req.query);
  //console.log('Peticion recibida 2::::>', paramsss);
  let unicocode = moment().format("MMDDYYYYHHMMSS");
  var key = unicocode + req.query.filename;
  var bucket = bucketName;
  var params = {
    Bucket: bucket,
    Expires: 3600,
    Conditions: [
      // This depicts the ACL the file will have when uploaded
      { acl: "public-read-write" },
      { success_action_status: "201" },
      ["starts-with", "$Content-Type", ""],
      ["starts-with", "$key", ""]
    ]
  };

  const resSign = s3.createPresignedPost(params);

  let result = {
    signature: {
      "Content-Type": "",
      acl: "public-read-write",
      success_action_status: "201",
      key,
      ...resSign.fields // Additional fields submitted as headers to S3
    },
    postEndpoint: resSign.url
  };

  res.status(HttpStatus.OK).json(result);
};

const signedURL = (req, res, next) => {
  //let file = req.body;
  //let paramsss = req.params;
  console.log("Peticion recibida ::::>", req.body);
  //console.log('Peticion recibida 2::::>', paramsss);
  let unicocode = moment().format("MMDDYYYYHHMMSS");
  var key = unicocode + req.body.fileName;
  var bucket = bucketName;
  var params = {
    Key: key,
    Bucket: bucket,
    ContentType: "image/jpg",
    ACL: "public-read"
  };

  s3.getSignedUrl("putObject", params, (error, url) => {
    if (error) {
      console.log("Error al general URL Signed");
    } else {
      console.log("URL Generated :::>", url);
      res.status(HttpStatus.OK).json(url);
    }
  });
};

const sendFile = (req, res, next) => {
  //let file = req.body;
  //console.log('Peticion recibida send file::::>', file);

  res.status(HttpStatus.OK).json({ message: "File uploaded" });
};

module.exports = {
  signedS3,
  sendFile,
  signedURL
};

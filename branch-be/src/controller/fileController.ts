import HttpStatus from "http-status-codes";
import AWS from "aws-sdk";
import moment from "moment";
import { Request, Response } from "express";
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_MEDIA,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_MEDIA,
  region: process.env.AWS_DEFAULT_REGION_MEDIA
};

const bucketName = process.env.BUCKET_MEDIA_NAME || "branchmedia2";

const s3 = new AWS.S3(awsConfig);

const signedS3 = (req: Request, res: Response) => {
  //let file = req.body;
  //let paramsss = req.params;
  console.log("Peticion recibida ::::>", req.query);
  //console.log('Peticion recibida 2::::>', paramsss);
  const unicocode = moment().format("MMDDYYYYHHMMSS");
  const key = unicocode + req.query.filename;
  const bucket = bucketName;
  const params = {
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

  const result = {
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

const signedURL = (req: Request, res: Response) => {
  //let file = req.body;
  //let paramsss = req.params;
  console.log("Peticion recibida ::::>", req.body);
  //console.log('Peticion recibida 2::::>', paramsss);
  let unicocode = moment().format("MMDDYYYYHHMMSS");
  const key = unicocode + req.body.fileName;
  const bucket = bucketName;
  const params = {
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

const sendFile = (req: Request, res: Response) => {
  //let file = req.body;
  //console.log('Peticion recibida send file::::>', file);

  res.status(HttpStatus.OK).json({ message: "File uploaded" });
};

export default {
  signedS3,
  sendFile,
  signedURL
};

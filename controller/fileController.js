let HttpStatus = require('http-status-codes');
let AWS = require('aws-sdk');
let moment = require('moment');
//var v4 = require('aws-signature-v4');
const awsConfig = {
    accessKeyId: 'AKIAJSZW5EH6Z6XEZQTA',
    secretAccessKey: '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',
    region: 'us-east-2'
}

var s3 = new AWS.S3(awsConfig);

/*
var params = {
    Bucket: "branchmedia",
    MaxKeys: 2
};

s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
});*/



/*
AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
    }
});
*/

const fileUpload = (req, res, next) => {
    //let file = req.body;
    //let paramsss = req.params;
    console.log('Peticion recibida ::::>', req.query);
    //console.log('Peticion recibida 2::::>', paramsss);
    let unicocode = moment().format("MMDDYYYYHHMMSS");
    var key = unicocode+req.query.filename;
    var bucket = 'branchmedia';
    var params = {
        Bucket: bucket,
        Expires: 3600,
        Conditions: [
            // This depicts the ACL the file will have when uploaded
            { 'acl': 'public-read-write' },
            { 'success_action_status': '201' },
            ['starts-with', '$Content-Type', ''],
            ['starts-with', '$key', ''],
        ]
    };

    const resSign = s3.createPresignedPost(params);

    let result = {
        signature: {
            'Content-Type': '',
            'acl': 'public-read-write',
            'success_action_status': '201',
            key,
            ...resSign.fields, // Additional fields submitted as headers to S3
        },
        postEndpoint: resSign.url,
    }

    res.status(HttpStatus.OK).json(result);

}


const sendFile = (req, res, next) => {
    let file = req.body;
    console.log('Peticion recibida send file::::>', file);


    res.status(HttpStatus.OK).json(file);
}





module.exports = {
    fileUpload,
    sendFile
}
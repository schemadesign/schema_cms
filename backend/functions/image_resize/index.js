'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.REDIRECT_URL;
const ALLOWED_DIMENSIONS = new Set();
const CORS_ORIGIN = process.env.CORS_ORIGIN;

if (process.env.ALLOWED_DIMENSIONS) {
  const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
  dimensions.forEach((dimension) => ALLOWED_DIMENSIONS.add(dimension));
}

exports.handler = function(event, context, callback) {
  const key = event.queryStringParameters.key;
  const match = key.match(/((\d+)x(\d+))\/(.*)/);
  const dimensions = match[1];
  const width = parseInt(match[2], 10);
  const height = parseInt(match[3], 10);
  const originalKey = match[4];

  console.log(`Key: ${key}, Width: ${width}, height: ${height}, Original Key: ${originalKey}`);

  if(ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(dimensions)) {
     callback(null, {
      statusCode: '403',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"message": "Not Allowed dimension"})
    });
    return;
  }

  S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
    .then(data => Sharp(data.Body)
      .resize(width, height)
      .toBuffer()
    )
    .then(buffer => S3.putObject({
        Body: buffer,
        Bucket: BUCKET,
        Key: key,
        ContentDisposition: "inline",
        ContentType: "image"
      }).promise()
    )
    .then(() => {
        const headers = {
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": CORS_ORIGIN,
            "Content-Type": "image",
            'Location': `${URL}/${key}`
        };
        return callback(null, {
            statusCode: '301',
            headers: headers,
            body: ''
          })
        }
    )
    .catch(err => callback(err))
}

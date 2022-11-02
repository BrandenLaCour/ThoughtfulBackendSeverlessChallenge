'use strict';

const AWS = require('aws-sdk');
const config = require('./config.json');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

module.exports.validatePassword = async (event, context, callback) => {
  
  const body = JSON.parse(event.body);
  const email = body.email
  const password = body.password
  let statusCode = 200
  let message = ''
  let item = null

  const dynamoDBGetParams = {
    TableName: "OneTimePasswords",
    Key: {
      "email": {
        S: email
       }, 
      "password": {
        S: password
       }
     }, 
     ReturnConsumedCapacity: "TOTAL",
     ConsistentRead: true,
     
    };
try {
  item = await new Promise((resolve, reject) => {
  dynamodb.getItem(dynamoDBGetParams, function(err, data){
      if (err) {
        console.log(err, err.stack);
        reject(err)

      }
      else {
        resolve(data.Item)
      }
  })
})
}
catch(e){
  message = "internal server error"
  statusCode = 500
}

if (item !== undefined){
  statusCode = 200
  message = "login successful"
}else{
  statusCode = 403
  message = 'email or password is incorrect'
}

  return {
    statusCode: statusCode,
    headers: {
      "Content-Type" : "application/json",
      "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods" : "OPTIONS, GET, POST",
      "Access-Control-Allow-Credentials" : true,
      "Access-Control-Allow-Origin" : "*",
      "X-Requested-With" : "*"
  },
    body: JSON.stringify({
      message: message
    }, 
    ),
  };
};
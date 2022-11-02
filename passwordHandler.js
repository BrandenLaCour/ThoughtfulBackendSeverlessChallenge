'use strict';

const AWS = require('aws-sdk');
const config = require('./config.json');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const ses = new AWS.SES();

const passwordGen = ()=> {

  const randomString = 'asdlkjasgouhaghnasdfljkd'
  let splitString = randomString.split('')
  splitString.sort((a,b)=> {
    return 0.5 - Math.random()
  })

  return splitString.join('')
  
}

module.exports.getPassword = (event, context, callback) => {

  const senderEmail = "brandenlacour@gmail.com"
  const password = passwordGen()
  const body = JSON.parse(event.body)
  const charset = 'UTF-8'
  const email = body.email
 
  const sesEmailParams = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Here is your OTP ${password}`,
          Charset: charset
        }
      },
      Subject: {
        Data: `OTP For ${email}`,
        Charset: charset
      }
    },
    Source: senderEmail,
    ReplyToAddresses: [senderEmail]
  };

  const dynamoDBPutParams = {
    Item: {
      "email": {
        S: email
       }, 
      "password": {
        S: password
       }
     }, 
     ReturnConsumedCapacity: "TOTAL", 
     TableName: "OneTimePasswords"
    };
  

  dynamodb.putItem(dynamoDBPutParams, function(err, data){
      if (err) console.log(err, err.stack);
      else console.log(data);
  });



  ses.sendEmail(sesEmailParams, function (err, data) {
      if (err) {
          console.log(err, err.stack);
          callback(err);
      } else {
        console.log("SES successful");
        console.log(data);
      }
  });

  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Check your email for a One Time Password'
    }),
  };

  
};
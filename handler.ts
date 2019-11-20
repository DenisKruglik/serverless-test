console.log('Handler runs');

import {Handler, Context, APIGatewayEvent, SQSEvent} from 'aws-lambda';
import * as mysql from 'promise-mysql';
import * as AWS from 'aws-sdk';

console.log('Imports done');

interface APIResponse {
  statusCode: number;
  headers?: object;
  body: string;
}

const config: mysql.ConnectionConfig = {
    host: 'test-database.ch8i3oprpx80.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'test_database'
};

const sqsQueueUrl = 'https://sqs.us-east-2.amazonaws.com/536289791254/Messages';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const addMessage: Handler = async (event: APIGatewayEvent, _context: Context) => {
  console.log('Function runs');
  let response: APIResponse;
  const requestParams = JSON.parse(event.body);
  const text = requestParams.text;
  const sqs = new AWS.SQS();
  const params = {
      MessageBody: JSON.stringify(text),
      QueueUrl: sqsQueueUrl
  };
  try {
      const data = await sqs.sendMessage(params).promise();
      response = {
          statusCode: 200,
          headers,
          body: JSON.stringify(data)
      };
  } catch (err) {
      console.log('Something went wrong', err);
      response = {
          statusCode: 400,
          headers,
          body: JSON.stringify('Failed to send message to SQS')
      };
  }
  return response;
};

const getMessages: Handler = async (_event: APIGatewayEvent, _context: Context) => {
  let response: APIResponse;
  let connection;
  try {
      connection = await mysql.createConnection(config);
      console.log('Trying to execute a query');
      const results = await connection.query("SELECT * FROM messages");
      console.log('Query executed successfully');
      response = {
          statusCode: 200,
          headers,
          body: JSON.stringify(results)
      }
  } catch(err) {
      console.log('Failed to fetch messages', err);
      response = {
          statusCode: 400,
          headers,
          body: JSON.stringify('Failed to fetch messages')
      }
  } finally {
      console.log('Closing connection');
      if (connection) {
          try {
              await connection.end();
              console.log('Connection closed successfully');
          } catch (err) {
              console.log('Something went wrong while closing the connection', err);
              connection.destroy();
          }
      }
  }
  return response;
};

const pushMessagesToDB: Handler = async (event: SQSEvent, _context: Context) => {
    console.log(event.Records);
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const values = [];
        event.Records.forEach(message => {
            const text = JSON.parse(message.body);
            values.push(text);
        });
        await connection.query("INSERT INTO messages (text) VALUES (?);", [values]);
    } catch (err) {
        console.log('Failed to receive messages from SQS', err);
    } finally {
        console.log('Closing connection');
        if (connection) {
            try {
                await connection.end();
                console.log('Connection closed successfully');
            } catch (err) {
                console.log('Something went wrong while closing the connection', err);
                connection.destroy();
            }
        }
    }
};

export { addMessage, getMessages, pushMessagesToDB }

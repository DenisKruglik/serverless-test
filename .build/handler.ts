import {Handler, Context, Callback, APIGatewayEvent} from 'aws-lambda';
import * as mysql from 'mysql';

interface HelloResponse {
    statusCode: number;
    body: string;
}

const connection = mysql.createConnection({
    host: 'test-database.ch8i3oprpx80.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'test_database'
});

const addMessage: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
    let response: HelloResponse;
    if (event.body) {
        const requestBody = JSON.parse(event.body);
        const text = requestBody.text;
        connection.query("INSERT INTO messages (text) VALUES (?);", [text], err => {
            if (err) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify('Necessary parameter \'text\' is missing.')
                };
            } else {
                response = {
                    statusCode: 200,
                    body: JSON.stringify('Message was added successfully.')
                };
            }
            callback(undefined, response);
        })
    } else {
        response = {
            statusCode: 400,
            body: JSON.stringify('Invalid request')
        };
        callback(undefined, response);
    }
};

export { addMessage }

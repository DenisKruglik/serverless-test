"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = __importStar(require("mysql"));
var connection = mysql.createConnection({
    host: 'test-database.ch8i3oprpx80.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'test_database'
});
var addMessage = function (event, context, callback) {
    var response;
    if (event.body) {
        var requestBody = JSON.parse(event.body);
        var text = requestBody.text;
        connection.query("INSERT INTO messages (text) VALUES (?);", [text], function (err) {
            if (err) {
                response = {
                    statusCode: 400,
                    body: JSON.stringify('Necessary parameter \'text\' is missing.')
                };
            }
            else {
                response = {
                    statusCode: 200,
                    body: JSON.stringify('Message was added successfully.')
                };
            }
            callback(undefined, response);
        });
    }
    else {
        response = {
            statusCode: 400,
            body: JSON.stringify('Invalid request')
        };
        callback(undefined, response);
    }
};
exports.addMessage = addMessage;

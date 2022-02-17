import { DynamoDBClient, ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult,  Context, Callback } from 'aws-lambda';
import { getDBClient } from "./dynamo-db-client";

export const list: APIGatewayProxyHandler = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
    const dynamoDBClient: DynamoDBClient = getDBClient();

    let response: APIGatewayProxyResult;

    // Set the parameters
    const params: ScanCommandInput = {
        TableName: process.env.DYNAMODB_TABLE,
    };

    // write the to do to the database
    dynamoDBClient.send(new ScanCommand(params), (error, data: ScanCommandOutput) => {
        // handle potential errors
        if (error) {
            console.error(error);
            response = {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the todo item.',
            };
        } else {
            response = {
                statusCode: 200,
                body: JSON.stringify(data.Items),
            };
        }

        callback(null, response);
    });
}


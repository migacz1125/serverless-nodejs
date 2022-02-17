import { DynamoDBClient, GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult,  Context, Callback } from 'aws-lambda';
import { getDBClient } from "./dynamo-db-client";

export const item: APIGatewayProxyHandler = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
    const dynamoDBClient: DynamoDBClient = getDBClient();
    let response: APIGatewayProxyResult;

    // Set the parameters
    const params: GetItemCommandInput = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: { S: event.pathParameters.id },
        },
        ProjectionExpression: "id",
    };

    dynamoDBClient.send(new GetItemCommand(params), (error, data: GetItemCommandOutput) => {
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
                body: JSON.stringify(data.Item),
            };
        }

        callback(null, response);
    });

}

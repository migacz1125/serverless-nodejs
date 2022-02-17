import {DeleteItemCommand, DeleteItemCommandInput,
    DeleteItemCommandOutput, DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';
import { v1 as uuid } from 'uuid';
import {getDBClient} from "./dynamo-db-client";

export const deleteList = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
    const dynamoDBClient: DynamoDBClient = getDBClient();

    const deleteItemInput: DeleteItemCommandInput = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: { S: event.pathParameters.id },
        },
    };

    let response: APIGatewayProxyResult;

    // write the to do to the database
    dynamoDBClient.send(new DeleteItemCommand(deleteItemInput), (error, data: DeleteItemCommandOutput) => {
        if (error) {
            console.error('error: ', error);
            response = {
                statusCode: error.statusCode || '501',
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the todo item.',
            };
        } else {
            response = {
                statusCode: 200,
                body: JSON.stringify(data.Attributes.id),
            };
        }

        callback(null, response);
    });
}

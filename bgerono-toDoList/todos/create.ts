import { DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';
import { v1 as uuid } from 'uuid';
import {getDBClient} from "./dynamo-db-client";

export const create = (event: APIGatewayProxyEvent, context: Context, callback: Callback<APIGatewayProxyResult>) => {
    const dynamoDBClient: DynamoDBClient = getDBClient();
    const data = JSON.parse(event.body);

    const putItemInput: PutItemCommandInput = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            "id": { S: uuid() },
            "name": { S: data.name },
            "checked": { BOOL: data.checked },
        },
    };

    let response: APIGatewayProxyResult;

    // write the to do to the database
    dynamoDBClient.send(new PutItemCommand(putItemInput), (error, data: PutItemCommandOutput) => {
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
                body: JSON.stringify(data.Attributes.Item),
            };
        }

        callback(null, response);
    });
}

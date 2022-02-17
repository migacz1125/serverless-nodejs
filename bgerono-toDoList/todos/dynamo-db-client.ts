import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export const getDBClient = () => {
    const awsRegion: string = process.env.AWS_REGION ? process.env.AWS_REGION : 'eu-central-1';
    let dynamoDBClientConfig: DynamoDBClientConfig;

    // connect to local DB if running offline
    if (process.env.IS_OFFLINE) {
        dynamoDBClientConfig = {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
        };
    } else {
        dynamoDBClientConfig = { region: awsRegion };
    }

    return new DynamoDBClient(dynamoDBClientConfig);
}


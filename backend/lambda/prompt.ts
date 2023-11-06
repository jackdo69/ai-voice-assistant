import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { SecretService } from "./secret.service";
import { OpenAiService } from "./openai.service";
import { RequestBody } from "./types";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log("Event received: ", event);
  const secretsService = new SecretService(new SecretsManager({ region: "ap-southeast-2" }));
  const openAiService = new OpenAiService(secretsService);
  const { body } = event;
  const { prompt } = JSON.parse(body as string) as RequestBody;
  const answer = await openAiService.getAnswer(prompt);
  return processResponse(200, { answer });
};

export const processResponse = (
  status: number,
  body: Record<string, any>
): APIGatewayProxyResult => {
  return {
    body: JSON.stringify(body),
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Content-control": "no-store",
      Pragma: "no-cache",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Access-Control-Allow-Credentials": true
    }
  };
};

import { RemovalPolicy } from "aws-cdk-lib";
import { Cors, LambdaIntegration, LogGroupLogDestination, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class ApiGateway extends RestApi {
  constructor(scope: Construct) {
    const ID = "ApiGateway";
    super(scope, ID, {
      restApiName: "voice-assistant-api-gateway",
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "correlation-object",
          "x-amz-security-token"
        ],
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowCredentials: true
      },
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(
          new LogGroup(scope, "ApiLogGroup", {
            logGroupName: "voice-assistant-gateway_log-group",
            retention: RetentionDays.ONE_DAY,
            removalPolicy: RemovalPolicy.DESTROY
          })
        )
      }
    });
  }

  addIntegration(method: string, path: string, lambda: IFunction) {
    const resource = this.root.resourceForPath(path);
    resource.addMethod(method, new LambdaIntegration(lambda));
  }
}

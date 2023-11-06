import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGateway } from "./ApiGateway";
import { Lambda } from "./Lambda";

export class VoiceAssistantStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const api = new ApiGateway(this);
    const prompt = new Lambda(this, "prompt");

    api.addIntegration("POST", "/prompt", prompt);
  }
}

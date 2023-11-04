#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { AiVoiceAssistantStack } from "../lib/ai-voice-assistant-stack";

const app = new App();
new AiVoiceAssistantStack(app, "AiVoiceAssistantStack", {
  env: {
    account: "683793928497",
    region: "ap-southeast-2"
  }
});

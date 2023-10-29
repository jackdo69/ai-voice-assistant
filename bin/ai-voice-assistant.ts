#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AiVoiceAssistantStack } from "../lib/ai-voice-assistant-stack";

const app = new cdk.App();
new AiVoiceAssistantStack(app, "AiVoiceAssistantStack", {});

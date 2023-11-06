import { SecretService } from "./secret.service";
import {
  OPEN_AI_KEY_SECRET_NAME,
  OPEN_AI_MODEL,
  OPEN_AI_ROLE,
  OPEN_AI_SERVICE_URL,
  OPEN_AI_URL
} from "./constants";
import axios from "axios";

export interface IOpenAiService {
  getAnswer(prompt: string): Promise<string>;
}

export class OpenAiService implements IOpenAiService {
  private secretService: SecretService;
  constructor(service: SecretService) {
    this.secretService = service;
  }
  async getAnswer(prompt: string): Promise<string> {
    console.log("getAnswer() called", { prompt }, this.constructor.name);

    const apiKey = await this.secretService.getSecretValue(OPEN_AI_KEY_SECRET_NAME, "value");
    const model = OPEN_AI_MODEL.GPT_35_TURBO;
    const role = OPEN_AI_ROLE.SYSTEM;

    return await this.getChatCompletions({ apiKey, content: prompt, model, role });
  }

  private async getChatCompletions({
    model,
    apiKey,
    content,
    role
  }: {
    model: OPEN_AI_MODEL;
    role: OPEN_AI_ROLE;
    apiKey: string;
    content: string;
  }) {
    console.log("getChatCompletions() called", { model, content }, this.constructor.name);
    try {
      const response = await axios.post(
        `${OPEN_AI_URL}${OPEN_AI_SERVICE_URL.CHAT_COMPLETION}`,
        {
          model,
          messages: [{ role, content }]
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          }
        }
      );
      console.log("OPEN AI response", { response }, this.constructor.name);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log("getChatCompletions() error", error);
      throw error;
    }
  }
}

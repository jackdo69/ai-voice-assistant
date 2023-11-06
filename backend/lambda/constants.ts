export enum OPEN_AI_ROLE {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant"
}

export enum OPEN_AI_MODEL {
  GPT_35_TURBO = "gpt-3.5-turbo"
}

export const OPEN_AI_URL = "https://api.openai.com";

export enum OPEN_AI_SERVICE_URL {
  CHAT_COMPLETION = "/v1/chat/completions",
  AUDIO_TRANSLATION = "/v1/audio/translations",
  FINE_TUNES = "/v1/fine-tunes"
}

export const OPEN_AI_KEY_SECRET_NAME = "OpenAIKey";

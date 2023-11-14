# AI voice assistant

## Process

1. Frontend is built from React App to collect user's command from voice using `react-speech-recognition`
2. The command will be forward to API Gateway then Lambda, which retrieve OPEN AI key from secrets manager and make call chatGPT model
3. The answers will then be converted back to voice by leveraging AWS Polly `text-to-speech`

## Useful commands

- `npm run install:web` install dependencies of React app
- `npm run build:web` build the frontend dist folder
- `npm run deploy:lambda` deploy the lambda code

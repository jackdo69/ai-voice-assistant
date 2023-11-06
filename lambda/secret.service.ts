import { SecretsManager } from "@aws-sdk/client-secrets-manager";

export class SecretService {
  private retrievedSecrets: { [key: string]: { [key: string]: string } } = {};
  private secretsManager: SecretsManager;

  constructor(secretsManager: SecretsManager) {
    this.secretsManager = secretsManager;
  }

  async getSecretValue(secretName: string, propertyName: string): Promise<string> {
    console.log("getSecretValue() called", { secretName, propertyName }, this.constructor.name);

    const parsedSecret = await this.getSecret(secretName);

    console.log("getSecretValue() returned", { parsedSecret });
    return parsedSecret[propertyName];
  }

  async getSecret(secretName: string): Promise<{ [key: string]: string }> {
    console.log("getSecret() called", secretName, this.constructor.name);

    // If the secret key has already been retrieved, then use the value from memory
    if (this.retrievedSecrets[secretName] !== undefined) {
      console.log("Secret retrieved from cache", null, this.constructor.name);
      return this.retrievedSecrets[secretName];
    }

    console.log(
      "Calling Secrets Manager service to retrieve secret",
      secretName,
      this.constructor.name
    );

    // Save the retrieved key for reuse, until the container gets recycled
    const serializedSecret: string | undefined = await this.getSecretFromSecretsManager(secretName);

    if (!serializedSecret) {
      console.log(
        `getSecret(): The secret with name: ${secretName} was not found`,
        { secretName },
        this.constructor.name
      );
      throw new Error(`getSecret(): The secret with name: ${secretName} was not found`);
    }

    const parsedSecret = JSON.parse(serializedSecret);

    // In-memory cache of the parsed secret for subsequent requests
    this.retrievedSecrets[secretName] = parsedSecret;

    return parsedSecret;
  }

  private async getSecretFromSecretsManager(secretName: string): Promise<string | undefined> {
    console.log(
      "Calling Secrets Manager service to retrieve secret",
      secretName,
      this.constructor.name
    );

    // Retrieve the decrypted secret key through the AWS Secrets Manager
    // This requires manual setup of a stored secret through the Secrets Manager
    // See the README.md file at the root of this repository for details.
    const response = await this.secretsManager.getSecretValue({ SecretId: secretName });

    // Save the retrieved key for reuse, until the container gets recycled
    return response.SecretString;
  }
}

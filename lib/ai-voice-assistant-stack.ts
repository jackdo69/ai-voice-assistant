import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as route53 from "@aws-cdk/aws-route53";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { Distribution, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { S3Origin } from "@aws-cdk/aws-cloudfront-origins";
import { Bucket, BucketAccessControl } from "@aws-cdk/aws-s3";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import * as path from "path";

const WEB_APP_DOMAIN = "voice-assistant.jackdo.dev";
export class AiVoiceAssistantStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3 bucket for holding the website
    const bucket = new Bucket(this, "Bucket", {
      accessControl: BucketAccessControl.PRIVATE
    });

    //upload the app to the s3 bucket
    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, "../frontend/dist"))]
    });

    // create distribution for the bucket
    const originAccessIdentity = new OriginAccessIdentity(this, "OriginAccessIdentity");
    bucket.grantRead(originAccessIdentity);

    new Distribution(this, "Distribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity })
      }
    });
  }
}

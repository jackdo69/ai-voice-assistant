import * as cdk from "@aws-cdk/core";
import { HostedZone, ARecord, RecordTarget } from "@aws-cdk/aws-route53";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import {
  OriginAccessIdentity,
  CloudFrontWebDistribution,
  SecurityPolicyProtocol,
  OriginProtocolPolicy
} from "@aws-cdk/aws-cloudfront";
import * as targets from "@aws-cdk/aws-route53-targets";
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
    // const originAccessIdentity = new OriginAccessIdentity(this, "OriginAccessIdentity");
    // bucket.grantRead(originAccessIdentity);

    // new Distribution(this, "Distribution", {
    //   defaultRootObject: "index.html",
    //   defaultBehavior: {
    //     origin: new S3Origin(bucket, { originAccessIdentity })
    //   }
    // });

    //Get The Hosted Zone
    const zone = HostedZone.fromLookup(this, "Zone", {
      domainName: "jackdo.dev"
    });

    //Create Certificate
    const siteCertificateArn = new DnsValidatedCertificate(this, "SiteCertificate", {
      domainName: WEB_APP_DOMAIN,
      hostedZone: zone,
      region: "ap-southeast-2"
    }).certificateArn;

    //Create CloudFront Distribution
    const distribution = new CloudFrontWebDistribution(this, "SiteDistribution", {
      aliasConfiguration: {
        acmCertRef: siteCertificateArn,
        names: [WEB_APP_DOMAIN],
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019
      },
      originConfigs: [
        {
          customOriginSource: {
            domainName: bucket.bucketWebsiteDomainName,
            originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ]
    });
    //Create A Record Custom Domain to CloudFront CDN
    new ARecord(this, "SiteRecord", {
      recordName: WEB_APP_DOMAIN,
      target: RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });
  }
}

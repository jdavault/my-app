'use strict';

class LambdaAtEdge {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      'after:package:compileEvents': this.compileEvents.bind(this)
    };
  }

  compileEvents() {
    let ccfTemplate = this.serverless.service.provider.compiledCloudFormationTemplate;
    let Resources = ccfTemplate.Resources;
    let Outputs = ccfTemplate.Outputs;

    // Update the invoke permission to allow "*"
    const invokePermissionKey = Object.keys(Resources).find(k => /InvokePermission$/.test(k));
    if (invokePermissionKey) {
      Resources[invokePermissionKey].Properties.SourceArn = {
        "Fn::Join": [
          "",
          ["", "arn:", {"Ref": "AWS::Partition"}, ":cloudfront::", {"Ref": "AWS::AccountId"}, ":distribution/", "*"]
        ]
      };
    }
    // Remove CloudFrontDistribution
    if (Resources.CloudFrontDistribution) {
      delete Resources.CloudFrontDistribution;
    }
    if (Outputs.CloudFrontDistribution) {
      delete Outputs.CloudFrontDistribution;
    }
    if (Outputs.CloudFrontDistributionDomainName) {
      delete Outputs.CloudFrontDistributionDomainName;
    }
  }
}

module.exports = LambdaAtEdge;

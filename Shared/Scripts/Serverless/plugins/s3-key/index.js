'use strict';

class StripDateFromS3Key {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      'before:package:compileFunctions': this.compileFunctions.bind(this)
    };
  }

  compileFunctions() {
    if (this.serverless.service.package.artifactDirectoryName) {
      const [prefix, serviceName, stage] = this.serverless.service.package.artifactDirectoryName.split('/');
      this.serverless.service.package.artifactDirectoryName = `${serviceName}/${prefix}/${stage}`;
    }
  }
}

module.exports = StripDateFromS3Key;

import fs from 'fs';
import yargs from 'yargs';
const {pathToFile, s3Key, s3Bucket, resource} = yargs.argv;
const data = JSON.parse(fs.readFileSync(pathToFile,'utf8'));
data.Resources[resource].Properties.Code.S3Key = s3Key;
data.Resources[resource].Properties.Code.S3Bucket = s3Bucket;
const update = JSON.stringify(data, null, 2);
fs.writeFileSync(pathToFile, update);

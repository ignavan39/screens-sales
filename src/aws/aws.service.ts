import { Inject, Injectable } from '@nestjs/common';
import { AWS_PUBLIC_BUCKET_NAME } from 'src/constants';
import { fileManagerInterface, UploadFileInterface } from './aws.interface';

import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService implements fileManagerInterface {
  constructor(@Inject('S3') private readonly s3: S3) {
    this.s3 = new S3();
  }

  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<UploadFileInterface> {
    const uploadResult = await this.s3
      .upload({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    return { url: uploadResult.Location, key: uploadResult.Key };
  }

  async deleteFile(key: string) {
    await this.s3
      .deleteObject({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }

  async downloadFile(key: string) {
    return await this.s3
      .getObject({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
}

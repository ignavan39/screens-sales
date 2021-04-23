import { Injectable } from '@nestjs/common';
import { AWS_PUBLIC_BUCKET_NAME } from 'src/constants';
import { fileManagerInterface, UploadFileInterface } from './aws.interface';

import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsService implements fileManagerInterface {
  async uploadFile(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<UploadFileInterface> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    return { url: uploadResult.Location, key: uploadResult.Key };
  }

  async deleteFile(key: string) {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: AWS_PUBLIC_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
}

import { Module } from '@nestjs/common';
import { config, S3 } from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } from 'src/constants';
import { AwsService } from './aws.service';

config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_ACCESS_KEY,
  region: AWS_REGION,
});

@Module({
  providers: [{ provide: 'S3', useClass: S3 }, AwsService, S3],
  exports: [AwsService, S3],
})
export class AwsModule {}

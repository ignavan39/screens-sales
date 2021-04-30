import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsService } from './aws.service';

@Module({
  providers: [{ provide: AwsService, useValue: S3 }],
  exports: [AwsService],
})
export class AwsModule {}

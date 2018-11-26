import { FileUploadOptions } from '@ionic-native/file-transfer';
import { Task } from './../models/tasks/task.model';

interface FileUploadConfig {
  fileType: string;
  mediaName: string;
  key: string;
  task: Task;
}

export function getFileUploadOptions(config: FileUploadConfig): FileUploadOptions {

  return {
    fileKey: 'file',
    fileName: config.mediaName,
    chunkedMode: false,
    headers: { 'Authorization': '' },
    params: {
      key: config.key,
      success_action_status: '201',
      acl: 'public-read',
      AWSAccessKeyId: config.task.s3_access_key,
      policy: config.task.s3_policy,
      signature: config.task.s3_signature,
      'Content-Type': config.fileType,
      'Cache-Control': 'max-age:31536000',
    },
  };
}

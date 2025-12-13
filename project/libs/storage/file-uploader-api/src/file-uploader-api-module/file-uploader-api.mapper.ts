import { fillDto } from '@project/helpers';
import { FileUploaderEntity } from '@project/file-uploader';

import { UploadedFileRdo } from '../rdo/uploaded-file.rdo';

export function fileToRdo(file: FileUploaderEntity): UploadedFileRdo {
  return fillDto(UploadedFileRdo, file.toPOJO());
}

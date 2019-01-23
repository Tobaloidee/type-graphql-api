// Imports
import { Stream } from "stream";

export interface IUpload {
  createReadStream: () => Stream;
  encoding: string;
  filename: string;
  mimetype: string;
}

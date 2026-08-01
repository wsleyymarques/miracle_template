export const BUCKET_SERVICE = Symbol('BUCKET_SERVICE');

export interface BucketService {
  upload(file: Express.Multer.File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
}
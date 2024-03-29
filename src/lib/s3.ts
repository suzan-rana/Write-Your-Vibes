import { S3 } from "aws-sdk";
import { randomUUID } from "crypto";

export const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

export const getRandomKey = (fileType: string) => {
  const extension = fileType.split("/")[1] as string;
  const Key = `${randomUUID()}--${Date.now()}.${extension}`;
  return { Key, extension };
};
export const getS3Params = (extension: string, Key: string) => {
  return {
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
    Expires: 3600,
    ContentType: `image/${extension}`,
  };
};


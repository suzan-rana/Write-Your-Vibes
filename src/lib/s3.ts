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
export const uploadImageToS3 = async (
  url: string,
  key: string,
  image: File
) => {
  // Upload the selected image to the presigned URL
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
  return await fetch(url, {
    method: "PUT",
    body: image,
    headers: {
      "Content-Type": image.type,
    },
  })
    .then((r) => {
      return r.json();
    })
    .then((res) => {
      console.log("first", res);
    })
    .catch((err) => {
      console.log('ERROR', err)
    });
};

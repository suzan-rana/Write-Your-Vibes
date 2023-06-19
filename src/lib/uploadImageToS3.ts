import axios from "axios";

export const uploadImageToS3 = async (
  url: string,
  key: string,
  image: File,
  imageFields: any
) => {
  const uploadingUrl =
    url + "/" +
    key +
    "?" +
    `Content-Type=${encodeURIComponent(imageFields["Content-Type"])}` +
    "&" +
    `X-Amz-Algorithm=${encodeURIComponent(imageFields["X-Amz-Algorithm"])}` +
    "&" +
    `X-Amz-Credential=${encodeURIComponent(imageFields["X-Amz-Credential"])}` +
    "&" +
    `X-Amz-Date=${encodeURIComponent(imageFields["X-Amz-Date"])}` +
    "&" +
    `Policy=${encodeURIComponent(imageFields["Policy"])}` +
    "&" +
    `X-Amz-Expires=3600` +
    "&" +
    `X-Amz-Signature=${encodeURIComponent(imageFields["X-Amz-Signature"])}` +
    "&" +
    `X-Amz-SignedHeaders=host`;
  // Upload the selected image to the presigned URL
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
 const  newFormData = new FormData()
  newFormData.append('image', image)
  return await axios
    .put(uploadingUrl, newFormData, {
      headers: {
        // "Content-Type": image.type

        "Content-Type": "multipart/form-data"
      },
    })
    .then((res) => {
      console.log("first", res);
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
};

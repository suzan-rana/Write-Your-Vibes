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
      "Content-Type": image.type, // image/jpeg
    },
  })
    .then((r) => {
      return r.json();
    })
    .then((res) => {
      console.log("first", res);
    })
    .catch((err) => {
      console.log("ERROR", err);
    });
};

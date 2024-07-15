import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
//uploadFile.ts

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID! as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY! as string,
  },
});
export const uploadFile = async ({
  fileName,
  file,
  object,
}: {
  fileName: string;
  file: File;
  object: string;
}) => {
  try {
    const clearFileName = fileName.replaceAll(" ", "").toLowerCase();
    const sendRes = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: `${object}/${clearFileName}`,
        Body: file,
      })
    );
    const meta = sendRes.$metadata;
    if (meta.httpStatusCode !== 200)
      throw new Error(
        `Error uploading file, with status: ${meta.httpStatusCode}`
      );

    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${object}/${clearFileName}`;
  } catch (err) {
    console.log(err);
  }
};

export const deleteFile = async ({ fileUrl }: { fileUrl: string }) => {
  try {
    const toReturn = fileUrl.split("/");
    const key = toReturn[toReturn.length - 1];
    const object = toReturn[toReturn.length - 2];
    const sendRes = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: `${object}/${key}`,
      })
    );
    const meta = sendRes.$metadata;
    if (meta.httpStatusCode !== 200)
      throw new Error(
        `Error Deleting file, with status: ${meta.httpStatusCode}`
      );
    return { status: meta.httpStatusCode };
  } catch (err) {
    console.log(err);
  }
};

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
    const sendRes = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: `${object}/${fileName}`,
        Body: file,
      })
    );
    const meta = sendRes.$metadata;
    if (meta.httpStatusCode !== 200)
      throw new Error(
        `Error uploading file, with status: ${meta.httpStatusCode}`
      );

    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${object}/${fileName}`;
  } catch (err) {
    console.log(err);
  }
};

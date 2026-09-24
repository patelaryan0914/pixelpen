import "server-only";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_S3_REGION!;
const bucket = process.env.AWS_S3_BUCKET!;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function putObject({
  fileName,
  body,
  object,
  contentType,
}: {
  fileName: string;
  body: Buffer | Uint8Array;
  object: string;
  contentType?: string;
}): Promise<string> {
  const clearFileName = fileName.replaceAll(" ", "").toLowerCase();
  const key = `pixelpen/${object}/${clearFileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `https://${bucket}.s3.amazonaws.com/${key}`;
}

export async function deleteObject(fileUrl: string): Promise<void> {
  // Key is the full path after the host, e.g. "pixelpen/blog-images/foo.png"
  const key = decodeURIComponent(new URL(fileUrl).pathname.slice(1));

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

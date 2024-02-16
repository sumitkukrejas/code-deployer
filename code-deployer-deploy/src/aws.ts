import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "./utils/constants";
import path from 'path';
import fs from 'fs';

const s3 = new S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
});

export async function downloadS3Folder(prefix: string) {
    try {
        const allFiles = await s3.listObjectsV2({
            Bucket: "github-repos-bulding-vercel",
            Prefix: prefix
        }).promise();

        const allPromises = allFiles.Contents?.map(({ Key }) => {
            return new Promise((resolve, reject) => {
                if (!Key) {
                    resolve("");
                    return;
                }
                // const finalOutputPath = path.join(process.cwd(), Key); // Use process.cwd() for reliable directory path
                const finalOutputPath = `/output/${Key}`
                const outputFile = fs.createWriteStream(finalOutputPath);
                const dirName = path.dirname(finalOutputPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }
                const stream = s3.getObject({
                    Bucket: "github-repos-bulding-vercel",
                    Key
                }).createReadStream();

                stream.on('error', err => {
                    reject(err);
                });

                stream.pipe(outputFile).on("finish", () => {
                    resolve("");
                });
            });
        }) || [];

        console.log("awaiting");
        await Promise.all(allPromises);
        console.log("All files downloaded successfully.");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

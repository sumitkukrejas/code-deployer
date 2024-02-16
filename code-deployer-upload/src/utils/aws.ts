import { S3 } from "aws-sdk"
import fs from 'fs'
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY } from "./constants";
const s3 = new S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
})

async function uploadFile(fileName: string, localFilePath: string) {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: 'github-repos-bulding-vercel',
        Key: fileName
    }).promise();
}
module.exports = uploadFile;
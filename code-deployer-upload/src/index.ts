import express from 'express'
import cors from 'cors';
import simpleGit from 'simple-git';
import path from 'path'
import { OUTPUT_DIR } from './utils/constants';
import { createClient } from 'redis';
const generate = require('./utils/generate');
const getAllFiles = require('./utils/files');
const uploadFile = require('./utils/aws')

const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.post('/deploy', async (req, res) => {
    const repoUrl = req.body.url;
    //generating random id
    const id = generate();
    //cloning a repo locally
    await simpleGit().clone(repoUrl, path.join(__dirname, `${OUTPUT_DIR}/${id}`));
    //listing all the files in the repo 
    const files = getAllFiles(path.join(__dirname + `/${OUTPUT_DIR}/${id}`));
    //uploading all the files on s3 bucket
    files.forEach(async (file: string | any[]) => {
        await uploadFile(file.slice(__dirname.length + 1), file)
    })
    //adding repo id to queue
    publisher.lPush('build-queue', id);

    res.json({
        id: id
    })
})

app.listen(3000);
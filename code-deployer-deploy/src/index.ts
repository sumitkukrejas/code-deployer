import { commandOptions, createClient } from 'redis';
import { downloadS3Folder } from './aws';
const subscriber = createClient();
subscriber.connect();

async function main() {
    while (true) {
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        )
        // @ts-ignore
        const id = response.element;
        await downloadS3Folder(`/output/${id}`);
        console.log("downloaded")
    }
}
main()
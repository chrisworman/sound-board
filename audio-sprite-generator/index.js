import fs from 'fs';
import path from 'path';
import wavconcat from 'wav-concat';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { Lame } from 'node-lame';

const AUDIO_FILE_DIRECTORY = './audio-files/';

async function generateAudioSprite() {
    const audioFileNames = fs.readdirSync(AUDIO_FILE_DIRECTORY);
    audioFileNames.sort();

    const audioFilePaths = audioFileNames.map(x => `${AUDIO_FILE_DIRECTORY}${x}`);
    console.log('Processing WAV files:', audioFilePaths);

    console.log('Caculating lengths and offsets ...');
    let offsetMs = 0;
    let offsetAndLengthData = {};
    for (const audioFilePath of audioFilePaths) {
        const durationSeconds = await getAudioDurationInSeconds(audioFilePath);
        const durationMs = Math.ceil(durationSeconds * 1000);
        const spriteName = path
            .basename(audioFilePath)
            .substring(4)
            .replace('.wav', '')
            .replaceAll('_', ' ');
        offsetAndLengthData[spriteName] = [offsetMs, durationMs];
        offsetMs += durationMs;
    }

    console.log('Creating sprite.json ...');
    const offsetAndLengthDataJson = JSON.stringify(offsetAndLengthData);
    fs.writeFileSync('../sprite.json', offsetAndLengthDataJson);

    console.log('Concatenating WAV files ...');
    wavconcat(audioFilePaths)
        .concat('sprite.wav')
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Concatenated WAV file created: ', output)

            console.log('Encoding concatenated file as MP3 ...');
            const encoder = new Lame({
                output: "../sprite.mp3",
                bitrate: 192,
            }).setFile('./sprite.wav');
            
            encoder
                .encode()
                .then(() => {
                    console.log('MP3 encoding finished');
                })
                .catch((error) => {
                    console.error('MP3 encoding error', error);
                });

        });
}

try {
    await generateAudioSprite();
} catch (e) {
    console.error(e);
}

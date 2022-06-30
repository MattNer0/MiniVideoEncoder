/*
 * Probe module
 */
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

module.exports = {
    encodeX265(inputAsset, outputAsset, videoSize, encodingInstructions, onProgress) {
        return new Promise(function(resolve, reject) {
            ffmpeg()
                .input(inputAsset)
                .videoBitrate(encodingInstructions.videoBitrate)
                .videoCodec(encodingInstructions.videoEncoder)
                .size(videoSize)
                .fps(encodingInstructions.videoFps)
                .audioCodec(encodingInstructions.audioEncoder)
                .audioBitrate(encodingInstructions.audioBitrate)
                .audioFrequency(encodingInstructions.audioFrequency)
                .audioChannels(encodingInstructions.audioChannels)
                .outputOption([
                    '-force_key_frames expr:gte(t,n_forced*2)',
                    '-x265-params keyint=48:min-keyint=48:scenecut=0:ref=5:bframes=3:b-adapt=2'
                ])
                .on('progress', onProgress)
                .on('end', resolve)
                .on('error', (err, stdout, stderr) => {
                    reject({ err, stdout, stderr })
                })
                .save(outputAsset);
        });
    },
    encodeVP9(inputAsset, outputAsset, videoSize, encodingInstructions, onProgress) {
        return new Promise(function(resolve, reject) {
            ffmpeg()
                .input(inputAsset)
                .videoBitrate(encodingInstructions.videoBitrate)
                .videoCodec(encodingInstructions.videoEncoder)
                .size(videoSize)
                .fps(encodingInstructions.videoFps)
                .audioCodec(encodingInstructions.audioEncoder)
                .audioBitrate(encodingInstructions.audioBitrate)
                .audioFrequency(encodingInstructions.audioFrequency)
                .audioChannels(encodingInstructions.audioChannels)
                .outputOption([
                    '-crf 23',
                    '-keyint_min 48',
                    '-g 48',
                    '-t 60',
                    '-threads 8',
                    '-speed 4',
                    '-tile-columns 4',
                    '-auto-alt-ref 1',
                    '-lag-in-frames 25',
                    '-frame-parallel 1',
                    '-af channelmap=channel_layout=5.1',
                ])
                .on('progress', onProgress)
                .on('end', resolve)
                .on('error', (err, stdout, stderr) => {
                    reject({ err, stdout, stderr })
                })
                .save(outputAsset);
        });
    },
    encodeX264(inputAsset, outputAsset, videoSize, encodingInstructions, onProgress) {
        return new Promise(function(resolve, reject) {
            ffmpeg()
                .input(inputAsset)
                .videoBitrate(encodingInstructions.videoBitrate)
                .videoCodec(encodingInstructions.videoEncoder)
                .size(videoSize)
                .fps(encodingInstructions.videoFps)
                .audioCodec(encodingInstructions.audioEncoder)
                .audioBitrate(encodingInstructions.audioBitrate)
                .audioFrequency(encodingInstructions.audioFrequency)
                .audioChannels(encodingInstructions.audioChannels)
                .outputOption([
                    '-crf 23',
                    '-force_key_frames expr:gte(t,n_forced*2)',
                    '-g 48',
                    '-keyint_min 48',
                    '-sc_threshold 0',
                    '-bf 3',
                    '-b_strategy 2',
                    '-refs 5'
                ])
                .on('progress', onProgress)
                .on('end', resolve)
                .on('error', (err, stdout, stderr) => {
                    reject({ err, stdout, stderr })
                })
                .save(outputAsset);
        });
    },
    takeScreenshots(inputAsset, outputFolder) {
        return new Promise(function(resolve, reject) {
            ffmpeg()
                .input(inputAsset)
                //.videoFilters(['select=\'gt(scene\,0.1)\''])
                //.noAudio()
                //.outputOption(['-vsync vfr'])
                .on('end', resolve)
                .on('error', (err, stdout, stderr) => {
                    reject({ err, stdout, stderr })
                })
                .screenshots({
                    count: 6,
                    filename: '%b-%02d.png',
                    folder: outputFolder
                })
        });
    }
};

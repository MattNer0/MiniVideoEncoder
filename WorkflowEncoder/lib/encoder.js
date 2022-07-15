/*
 * Video and audio encoder for encoding video and audio
 */

// Dependencies
const { parentPort, workerData } = require('worker_threads');

const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const probe = require('./probe');
const encoder = require('./encoderAsync');
const log = require('./log');
const constants = require('./constants');

async function encode() {
  const encodingInstructions = workerData;
  const startTime = Date.now();
  const inputAsset = path.join(encodingInstructions.inputFolder, encodingInstructions.inputAsset);
  const outputAsset = path.join(encodingInstructions.outputFolder, encodingInstructions.outputAsset);
  let videoSize = encodingInstructions.videoSize

  const onProgressCallback = function(info) {
    const message = {};
    message.type = constants.WORKER_MESSAGE_TYPES.PROGRESS;
    message.message = `Encoding: ${Math.round(info.percent)}%`;
    parentPort.postMessage(message);
  }

  log.debug(`input: ${inputAsset}`);
  log.debug(`output: ${outputAsset}`);

  try {
    const metadata = await probe.ffprobe(inputAsset);
    if (Array.isArray(metadata.streams)) {
      const videoStreams = metadata.streams.filter(function(stream) { return probe.isVideo(stream) });
      if (videoStreams.length === 0) {
        const message = {};
        message.type = constants.WORKER_MESSAGE_TYPES.ERROR;
        message.message = `No Video Stream Error. ${err.message}`;
        parentPort.postMessage(message);
        return
      }

      if (probe.isHorizontalButRotated(videoStreams[0]) || probe.isVertical(videoStreams[0])) {
          let sizeSplit = videoSize.split('x')
          videoSize = sizeSplit[1] + 'x' + sizeSplit[0]

          log.info(`Video will be rotated 90 degrees`);
      }
    }
  } catch(err) {
    log.error(`Probe error: ${err.message}`);
  }

  try {
    if (encodingInstructions.videoEncoder === constants.ENCODER_TYPES.X265) {
      await encoder.encodeX265(inputAsset, outputAsset, videoSize, encodingInstructions, onProgressCallback)

      /*parentPort.on('message', (message) => {
        if (message.type === constants.WORKER_MESSAGE_TYPES.STOP_ENCODING) {
          // Main thread asks to kill this thread.
          log.info('Main thread asked to stop this thread');
          ffmpegCommand.kill();
        }
      });*/
    } else if (encodingInstructions.videoEncoder === constants.ENCODER_TYPES.VP9) {
      await encoder.encodeVP9(inputAsset, outputAsset, videoSize, encodingInstructions, onProgressCallback)

    } else if (encodingInstructions.videoEncoder === constants.ENCODER_TYPES.X264) {
      await encoder.encodeX264(inputAsset, outputAsset, videoSize, encodingInstructions, onProgressCallback)

    }

    if (encodingInstructions.screenshots && videoSize) {
      try {
        log.info(`I will take video thumbnails...`);
        const sizeSplit = videoSize.split('x')
        const finalSize = {
          width : parseInt(sizeSplit[0]),
          height: parseInt(sizeSplit[1])
        }

        const screenshotFilename = encodingInstructions.outputAsset.replace(`_${encodingInstructions.videoSize.replace('x', '_')}_${encodingInstructions.videoBitrate}.`, '.')

        await encoder.takeScreenshots(outputAsset, encodingInstructions.outputFolder, 6, screenshotFilename + '-%0i.png', finalSize)
        await encoder.takeScreenshots(outputAsset, encodingInstructions.outputFolder, 6, screenshotFilename + '-%0i-thumb.png', {
          width : Math.floor(finalSize.width / 2),
          height: Math.floor(finalSize.height / 2)
        })

      } catch({ err, stdout, stderr }) {
        log.error(`Screenshots error: ${err.message}`);
        log.error(`ffmpeg output: ${stdout}`);
        log.error(`ffmpeg stderr: ${stderr}`);
      }
    }

    const message = {};
    message.type = constants.WORKER_MESSAGE_TYPES.DONE;
    const endTime = Date.now();
    message.message = `Encoding finished after ${(endTime - startTime) / 1000} s`;
    parentPort.postMessage(message);

  } catch({ err, stdout, stderr }) {
    const message = {};
    message.type = constants.WORKER_MESSAGE_TYPES.ERROR;
    message.message = `An error occurred during encoding. ${err.message}`;
    parentPort.postMessage(message);

    log.error(`Error: ${err.message}`);
    log.error(`ffmpeg output: ${stdout}`);
    log.error(`ffmpeg stderr: ${stderr}`);
  }
}

encode();

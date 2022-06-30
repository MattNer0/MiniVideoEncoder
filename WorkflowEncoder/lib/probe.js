/*
 * Probe module
 */
const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    ffprobe(inputAsset) {
        return new Promise(function(resolve, reject) {
            ffmpeg.ffprobe(inputAsset, function(err, metadata) {
                if (err) {
                    reject(err);
                } else {
                    resolve(metadata)
                }
            });
        })
    },
    isVideo(stream) {
        return Boolean(stream.codec_type === 'video')
    },
    isHorizontal(stream) {
        return Boolean(stream.width >= stream.height);
    },
    isVertical(stream) {
        return Boolean(stream.width < stream.height);
    },
    isHorizontalButRotated(stream) {
        if (stream.width > stream.height) {
            if (stream.tags && (stream.tags.rotate === "90" || stream.tags.rotate === "270")) {
                return true
            }
        }

        return false
    }
};

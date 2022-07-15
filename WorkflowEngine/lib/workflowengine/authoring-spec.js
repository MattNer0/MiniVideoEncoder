/*
 * authoringSpec, various bitrate, resolution ladders for encoding
 */

// Dependencies

const log = require('../log');

const authoringSpec = {};

authoringSpec.specs = {};

authoringSpec.init = function init() {
  authoringSpec.specs['sb-x265-medium'] = {
    encodingTracks: [
      {
        videoEncoder: 'libx265',
        videoSize: '768x432',
        videoBitrate: 300,
        videoFps    : 25,
        audioEncoder: 'copy',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
      {
        videoEncoder: 'libx265',
        videoSize: '960x540',
        videoBitrate: 900,
        videoFps    : 25,
        audioEncoder: 'copy',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
      {
        videoEncoder: 'libx265',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'copy',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
    ],
    /*packagingTracks: [
      {
        videoEncoder: 'libx265',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'copy',
        audioBitrate: '320k',
        audioFrequency: '48000',
        packager: 'hls-fmp4',
        audioChannels : 2
      },
    ],*/
  };

  authoringSpec.specs['sb-x264-medium'] = {
    videoMaxDuration: 31.0,
    encodingTracks  : [
      /*{
        videoEncoder: 'libx264',
        videoSize: '768x432',
        videoBitrate: 300,
        videoFps    : 25,
        audioEncoder: 'aac',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },*/
      {
        videoEncoder: 'libx264',
        videoSize: '960x540',
        videoBitrate: 900,
        videoFps    : 25,
        audioEncoder: 'aac',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2,
        screenshots: true
      },
      {
        videoEncoder: 'libx264',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'aac',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2,
        screenshots: false
      },
    ],
    /*packagingTracks: [
      {
        videoEncoder: 'libx264',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'aac',
        audioBitrate: '320k',
        audioFrequency: '48000',
        packager: 'hls-fmp4',
        audioChannels : 2
      },
    ],*/
  };

  authoringSpec.specs['sb-vp9-medium'] = {
    encodingTracks: [
      {
        videoEncoder: 'libvpx-vp9',
        videoSize: '768x432',
        videoBitrate: 300,
        videoFps    : 25,
        audioEncoder: 'libopus',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
      {
        videoEncoder: 'libvpx-vp9',
        videoSize: '960x540',
        videoBitrate: 900,
        videoFps    : 25,
        audioEncoder: 'libopus',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
      {
        videoEncoder: 'libvpx-vp9',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'libopus',
        audioBitrate: '320k',
        audioFrequency: '48000',
        audioChannels : 2
      },
    ],
    packagingTracks: [
      {
        videoEncoder: 'libvpx-vp9',
        videoSize: '1280x720',
        videoBitrate: 2400,
        videoFps    : 25,
        audioEncoder: 'libopus',
        audioBitrate: '320k',
        audioFrequency: '48000',
        packager: 'mpd',
        audioChannels : 2
      },
    ],
  };
};

authoringSpec.getAuthoringSpec = function getAuthoringSpec(specKey) {
  if (specKey in authoringSpec.specs) {
    return authoringSpec.specs[specKey];
  }
  log.error(`Could not find the authoring spec with key: ${specKey}`);
  return null;
};

authoringSpec.init();

module.exports = authoringSpec;

// Apple Authoring spec minimal for hevc
// 640 x 360 => 145
// 768 x 432 => 300
// 960 x 540 => 600
// 960 x 540 => 900
// 960 x 540 => 1600
// 1280 x 720 => 2400
// 1280 x 720 => 3400
// 1920 x 1080 => 4500
// 1920 x 1080 => 5800
// 2560 x 1440 => 8100
// 3840 x 2160 => 11600
// 3840 x 2160 => 16800

// Apple Authoring spec for avc
// 416 x 234 => 145
// 640 x 360 => 365
// 768 x 432 => 730
// 768 x 432 => 1100
// 960 x 540 => 2000
// 1280 x 720 => 3000
// 1280 x 720 => 4500
// 1920 x 1080 => 6000
// 1920 x 1080 => 7800

// Load the audio files as AudioBuffers
const audioCtx = new AudioContext();
const clappingUrl = 'AncientWorld.mp3';
const shoutingUrl = 'Blessing.mp3';

const loadAudio = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
  
};

const clappingBuffer = loadAudio(clappingUrl);
const shoutingBuffer =  loadAudio(shoutingUrl);
 


// Create a new buffer with the combined audio data
const totalDuration = Math.max(clappingBuffer.duration, shoutingBuffer.duration);
const totalChannels = Math.max(clappingBuffer.numberOfChannels, shoutingBuffer.numberOfChannels);
const combinedBuffer =
 audioCtx.createBuffer(totalChannels, totalDuration * 
    audioCtx.sampleRate, audioCtx.sampleRate);

const clappingData = clappingBuffer.getChannelData(0);
const shoutingData = shoutingBuffer.getChannelData(0);
const combinedData = combinedBuffer.getChannelData(0);

for (let i = 0; i < combinedBuffer.length; i++) {
  if (i < clappingBuffer.length && i < shoutingBuffer.length) {
    combinedData[i] = (clappingData[i] + shoutingData[i]) / 2;
  } else if (i < clappingBuffer.length) {
    combinedData[i] = clappingData[i];
  } else if (i < shoutingBuffer.length) {
    combinedData[i] = shoutingData[i];
  } else {
    combinedData[i] = 0;
  }
}

// Play the combined audio
const source = audioCtx.createBufferSource();
source.buffer = combinedBuffer;
source.connect(audioCtx.destination);
source.start();

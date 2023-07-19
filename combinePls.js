async function getMusicBuuffer(directory){ 
     let content = await fetch(directory)
                   .then(res => res.arrayBuffer());
//    now decoding the sound buufer
    content  = await new AudioContext().decodeAudioData(content);
    return content;
 }
 getMusicBuuffer("Gladiator - .mp3").then(res =>{
      var MusicOne = res

      getMusicBuuffer("Blessing.mp3").then(res => {
         var MusicTwo = res


        //  getting the duration and picking the max
    const combinedDuration = Math.max(MusicOne.duration,MusicTwo.duration);
    //  here for the number of channel for  the ombine
      const combinedChannel = Math.max(MusicOne.numberOfChannels,MusicTwo.numberOfChannels);
    //  here we create the combine Buffer -- the actual audio file
      const combinedBuffer = new AudioContext()
      .createBuffer(combinedChannel,combinedDuration*new AudioContext().sampleRate,new AudioContext().sampleRate);
       
    
    
    
    
    //    here we are getting the only the first channel data
      const MusicOneData = MusicOne.getChannelData(0);
      const MusicTwoData = MusicTwo.getChannelData(0);
      const combinedData = combinedBuffer.getChannelData(0);
    
    //    here we are replacing the data into the combine buffer
      for (let i = 0; i < combinedBuffer.length; i++) {
        
     if(i < MusicOne.length && i < MusicTwo.length){
          combinedData[i] = (2*MusicOneData[i] + MusicTwoData[i]/3)/2
     }else if(i < MusicOne){
         combinedData[i] = MusicOneData[i]
     }else if(i < MusicTwo){
        combinedData[i] = MusicTwoData[i]
    }else{
        combinedData[i] = 0
    }
     
    // creating a source node and assigning it to it
    
      }


      const contextAudio = new AudioContext()
      const soundNode = contextAudio.createBufferSource();
      soundNode.connect(contextAudio.destination)
      soundNode.buffer = combinedBuffer;

       soundNode.start();


      })
 })


import WaveformGenerator from 'waveform-generator-web';

function toArrBuff(audio){
 return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(audio);
  }) 
}

async function createWaveform(audio){
    let arrayBuffer = await toArrBuff(audio);
    var svgSettings = {
      barWidth: 5,
      waveformColor: '#ffec03',
      barGap: 0.2,
      drawMode: 'svg'};
    const generator = new WaveformGenerator(arrayBuffer );
    let url = await generator.getWaveform(svgSettings);
    return url;
};

export {createWaveform, toArrBuff}

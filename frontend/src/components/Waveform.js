import { useState, useEffect } from "react";
import { loadPlayer } from "../synth_module/createSample.js";
import * as Tone from "tone";
export default function Waveform(props) {
  let [wave, setWave] = useState(props.waveform);
  useEffect(() =>{
    setWave(props.wave)
  }, [props.wave])
    // console.log(f.getChannelData(0));
  return <img src={wave} />;
}

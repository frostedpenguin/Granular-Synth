import { useEffect } from "react";
import * as Tone from "tone"
import {Sample} from '../synth_module/createSample.js'
let keyboard = {
  // Lower octave.
  a: "C1",
  w: "C#1",
  s: "D1",
  e: "D#1",
  d: "E1",
  f: "F1",
  t: "F#1",
  g: "G1",
  y: "G#1",
  h: "A1",
  u: "A#1",
  j: "B1",
  // Upper octave.
  k: "C2",
  o: "C#2",
  l: "D2",
  p: "D#2",
};
function trigger(e) {
  if (!keyboard.hasOwnProperty(e.key)) return;
  if (!Sample.isSampler) return;
  Sample.sampler.triggerAttackRelease(
    keyboard[e.key],
    Sample.Preset.grain_size
  );
}
export default function Midi() {
  useEffect(() => {
    document.addEventListener("keydown", trigger);
    return () => document.removeEventListener("keydown", trigger);
  });
  return (<div/>)
}

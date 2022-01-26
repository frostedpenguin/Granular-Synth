import { useEffect, useRef, useState} from "react";
import Axios from "axios";
import { Sample } from "../synth_module/createSample";
import "./stylesheets/knobs.css";
import $ from "jquery";
import "jquery-knob";
import * as Tone from 'tone'
import Line from './Line'
export default function Knob(props) {
  async function updateValue(v) {
    setVal(v);
    if (!Sample.isSampler && Tone.Transport.state === "stopped") return;
    Sample.updatePreset(props.name, v, props.parent)
    Sample.play();
  }
  let init = useRef(false)
  let [val, setVal] = useState(props.value)
  useEffect(() => {
    async function fetch(name) {
      let knob_raw = await Axios.get("http://localhost:9000/knob/data/" + name);
      let knob_data = knob_raw.data;
      knob_data['release'] = function(v){ init.current && updateValue(v) }
      knob_data['change'] = function(v){( !init.current && ( init.current = true ) )}
      let class_name = "." + name;
      $(class_name).knob(knob_data);
      $(class_name).val(props.value);
      $(class_name).trigger("change");
    }
    fetch(props.name);
  },[props.name]);
  let is_grain_size = ( props.name === "grain_size" )
  return (
        <div className="knob">
    { is_grain_size && (<Line grain_size = {val} ></Line>) }
        <label>
        {props.name}
        <input
        type="text"
        className={props.name}
        data-fgcolor="#ffec03"
        data-skin="tron"
        data-width="75"
        data-thickness=".2"
        data-displayprevious={true}
        ></input>
        </label>
        </div>
  );
}

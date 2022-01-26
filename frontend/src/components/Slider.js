import { useState, useRef, useEffect } from "react";
import { useSpring, animated } from 'react-spring'
import "./stylesheets/slider.css";
import "./stylesheets/App.css";
import { Sample } from "../synth_module/createSample";
import * as Axios from "axios";
const MAX_SLIDER_POS = 100;
const PROCESSING_TIME = 1000;
export default function Slider(props) {
  let [slider_pos, setSliderPos] = useState(5);
  let [range, setRange] = useState(5);
  let [isSlider, setIsSlider] = useState(false);
  const [p, api] = useSpring(() => ({ opacity: 1 }))
  api.start({ opacity: isSlider ? 1 : 0 })
  async function cropAudio() {
    if (props.duration === 0) return;
    is_processing.current = true;
    setTimeout(() => {
      is_processing.current = false;
    }, PROCESSING_TIME);
    let percentage = offset.current;
    let range_percentage = range / 100;
    if (percentage > 1 - range_percentage) percentage = 1 - range_percentage;
    let start = props.duration * percentage;
    let stop = props.duration * (percentage + range_percentage);
    await Axios.post("http://localhost:9000/audio/cropped/", {
      start: start,
      stop: stop,
    });
    await Sample.setPlayer()
    Sample.play();
  }

  function adjustRange(e) {
    let temp_range = range;
    let step = e.deltaY / 50;
    temp_range += step;
    if (temp_range < 0.5) return;
    if (temp_range > 30 || slider_pos + range + step > MAX_SLIDER_POS) return;
    setRange(range + e.deltaY / 50);
  }
  function adjustSlider(e) {
    if (e.nativeEvent.which === 2) {
      cropAudio();
    Sample.setSliderStop(slider_pos + range)
      return;
    }
    if (is_processing.current) return;
    let click_offset = e.nativeEvent.offsetX;
    let max_offset = window.innerWidth - window.innerWidth * 0.06;
    offset.current = click_offset / max_offset;
    let slider_max_offset = MAX_SLIDER_POS - range;
    let slider_new_pos =  MAX_SLIDER_POS * offset.current;
    if (slider_new_pos > slider_max_offset) slider_new_pos = slider_max_offset
    Sample.setSliderStart(slider_new_pos)
    Sample.setSliderStop(slider_new_pos + range)
    setSliderPos(slider_new_pos);
    cropAudio();
  }
  function toggleSliderOn() {
    setIsSlider(true);
  }
  function toggleSliderOff() {
    setIsSlider(false);
  }
  let offset = useRef(0);
  let is_processing = useRef(false);
  return (
    <animated.div
      className="slider_cont"
      onMouseUp={adjustSlider.bind(this)}
      onWheel={adjustRange.bind(this)}
      onMouseOver={toggleSliderOn}
      onMouseLeave={toggleSliderOff}
      style ={p}
    >
    <div
    className="range"
    style={{
      left: slider_pos + "%",
        width: range + "%",
    }}
    ></div>
    <div className="slider" style={{ left: slider_pos + "%" }}></div>
    </animated.div>
  );
}

import { useState, useRef, useEffect } from "react";
import "./stylesheets/slider.css";
import * as Tone from 'tone'
import {  Sample } from '../synth_module/createSample'
import { useSpring, animated } from 'react-spring'
var ev = 0
export default function Line(props) {
  let [linePos, setLinePos] = useState(5);
  const p = useSpring({
    from : { opacity: 1 },
    to : { opacity: 0 },
    reset: true,
    config : {duration : 200}
  }) 
  useEffect(() => {
    if ( Tone.Transport.state === "started" ){
      Tone.Transport.clear(ev)
      // Tone.Transport.pause()
    }
    ev = Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        let offset = Sample.getOffset()
        setLinePos(offset)
      }, time);
    },props.grain_size + 0.05);
    // if ( Tone.Transport.state === "paused" )
    //   Tone.Transport.start()
    
  }, [props.grain_size]);
  return (
    <animated.div  style = {p}  className = "line_cont">
      <div className="line" style={{ left: linePos + "%" }}></div>
    </animated.div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Sample } from "../synth_module/createSample";
import Dropdown from "react-bootstrap/Dropdown";
import * as Axios from "axios"
import * as Tone from "tone"
export default function List(props) {
  let [list_elements, setListElements] = useState("");
  let [val, setVal]= useState('')
  useEffect(() => {
    async function fetch(name) {
      let temp = [];
      let list_el = await Axios.get("http://localhost:9000/knob/data/" + name);
      list_el = list_el.data
      for (const el of list_el) {
        let item = <Dropdown.Item onClick = { () => setVal(el) } >{ el }</Dropdown.Item>;
        temp.push(item);
      }
      setListElements(temp)
      return temp;
    }
    fetch(props.name);
  }, [props.name]);
  useEffect(() => {
    setVal(props.value) 
  },[props.value])
  useEffect(() => {
    if ( Tone.Transport.state !== "started") return;
    Sample.updatePreset(props.name, val, props.parent)
    Sample.play();
  },[val])
  return (
    <div id = {props.name}>
      <label> {props.name}</label>
      <Dropdown >
    <Dropdown.Toggle variant="secondary">{val}</Dropdown.Toggle>
    <Dropdown.Menu>{list_elements}</Dropdown.Menu>
    </Dropdown>
    </div>
  );
}

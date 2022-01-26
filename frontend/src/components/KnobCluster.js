import { useEffect, useState } from "react";
import Axios from "axios";
import Knob from "./Knob";
import "./stylesheets/knobs.css";
import List from "./List";
export default function KnobCluster(props) {
  function makeKnobElements(knob_tuples) {
    let temp = [];
    let it = Object.entries(knob_tuples);
    let it_index = Object.entries(it);
    for (var [index, [name, value]] of it_index) {
      if (name === "type") {
        let list_el = (
          <List
            key={index}
            name={name}
            value={value}
            parent={props.name}
          ></List>
        );
        temp.push(list_el);
        continue;
      }
      let knob_el = (
        <Knob key={index} name={name} value={value} parent={props.name}></Knob>
      );
      temp.push(knob_el);
    }
    return temp;
  }
  var [knob_elements, setKnobElements] = useState("");
  useEffect(() => {
    async function fetch(name) {
      let knob_raw = await Axios.get(
        "http://localhost:9000/presets/sets/" + name
      );
      let knob_tuples = knob_raw.data;
      setKnobElements(makeKnobElements(knob_tuples));
    }
    fetch(props.name);
  }, [props.name]);

  return (
    <div className="clusterWrapper">
      <h3>{props.name}</h3>
      <fieldset className="flexWrap" id={props.name}>
        {knob_elements}
      </fieldset>
    </div>
  );
}

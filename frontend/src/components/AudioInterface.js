import * as Tone from "tone";
import { Component } from "react";
import * as Axios from "axios";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import "./stylesheets/App.css";
import { createWaveform } from "../synth_module/waveform.js";
import { Sample, loadPlayer } from "../synth_module/createSample.js";
import Waveform from "./Waveform";
import Slider from "./Slider";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import Midi from "./Midi";
async function refreshAudio(mp3) {
  let req = new FormData();
  req.append("audio", mp3);
  await Axios.post("http://localhost:9000/audio/upload/", req);
}
export default class AudioInterface extends Component {
  constructor(props) {
    super(props);
    this.state = { wave: "", isSampler: false };
    this.is_upload = false;
    this.duration = 0;
  }
  pause = () =>{
    if (Tone.Transport.state === "started") Tone.Transport.stop()
  }
  chooseSample = async (e) => {
    if (!this.state.isSampler) return;
    if (Tone.Transport.state === "stopped") Tone.start();
    let click_offset = e.nativeEvent.offsetX;
    let max_offset = window.innerWidth - window.innerWidth * 0.06;
    var off = click_offset / max_offset;
    let start = this.duration * off;
    await Axios.post("http://localhost:9000/audio/cropped/", {
      start: start,
      stop: start + 1,
    });
    Sample.setSampler();
  };
  onFileUpload = async (event) => {
    let ev = event.target;
    let audio = ev.files[0];
    let waveform = await createWaveform(audio);
    await refreshAudio(audio);
    if (Tone.Transport.state === "started") Tone.Transport.pause();
    let player = await loadPlayer("upload");
    let buffer = player.buffer;
    this.duration = Math.floor(buffer.duration);

    this.setState({ wave: waveform });
  };

  initTone = () => {
    if (Tone.Transport.state === "stopped") Tone.start();
  };
  render() {
    return (
      <div>
        <div className="Waveform" onClick={this.chooseSample.bind(this)}>
          <Waveform wave={this.state.wave}></Waveform>
          {<Slider duration={this.duration}></Slider>}
        </div>
        <Stack direction="horizontal" gap={2}>
          <Stack direction="horizontal">
            <h5>sampler mode</h5>
            <BootstrapSwitchButton
              checked={this.state.isSampler}
              onlabel="on"
              offlabel="off"
              onstyle="light"
              offstyle="outline-light"
              style="border"
              onChange={(checked) => {
                this.setState({ isSampler: checked });
                if (checked) Tone.Transport.pause();
                else Sample.disconnectSampler();
              }}
            />
      <Button variant="light" style={{width : "50px", marginLeft:"20px", height: "40px"}} onClick={this.pause}>
      <svg style={{ display: "block", marginLeft:"5px"}} viewBox="0 0 60 60" >
      <polygon points="0,0 15,0 15,60 0,60" />
      <polygon points="25,0 40,0 40,60 25,60" />
      </svg>
      </Button>
          </Stack>
          <Midi />
          <Form className="ms-auto" encType="multipart/form-data">
            <Form.Control
              type="file"
              onChange={this.onFileUpload.bind(this)}
              onClick={this.initTone}
              name="audio"
            ></Form.Control>
          </Form>
        </Stack>
      </div>
    );
  }
}

import * as Tone from "tone";
import * as Axios from "axios";
function randomOffset(duration, grain_size) {
  var n = Math.random() * (duration - grain_size);
  return Number.parseFloat(n).toFixed(1);
}
function loadPlayer(audio_file, grain_size = 1, overlap = 1, reverse = 1) {
  return new Promise((resolve) => {
    const player = new Tone.GrainPlayer({
      url: "http://localhost:9000/audio/" + audio_file + "/",
      grainSize: grain_size,
      overlap: overlap,
      reverse: reverse,
    });
    Tone.loaded().then(() => {
      resolve(player);
    });
  });
}
class Sample { static sampler;
  static loop;
  static offset;
  static sample_duration;
  static slider_start;
  static slider_stop;
  static Preset;
  static Player;
  static gain;
  static pan;
  static filter;
  static reverb;
  static compressor;
  static delay;
  static phaser;
  static chain;
  static grain;
  static isSampler;
  line_pos = 0;
  offset_per = 0;
  slider_interval = 0;
  static setToggle(i, j) {
    var temp = Sample.chain[j];
    Sample.chain[j] = Sample.chain[i];
    Sample.chain[i] = temp;
  }
  static onDrop() {
    // Sample.setPlayer()
    Sample.initObjects();
    if(Sample.isSampler){
      Sample.disconnectSampler()
      Sample.setSampler()
      return;
    }
    if (Tone.Transport.state === "started")
    Sample.play();
  }
  static initObjects() {
    var preset = Sample.Preset;
    Sample.gain = new Tone.Gain(0).toDestination();
    Sample.pan = new Tone.Panner(preset.pan);
    Sample.filter = new Tone.Filter(preset.frequency, preset.type);
    Sample.reverb = new Tone.Reverb({
      decay: preset.decay,
      wet: preset.wet,
    });
    Sample.compressor = new Tone.Compressor(preset.threshold, preset.ratio);
    Sample.delay = new Tone.PingPongDelay({
      delayTime: preset.delayTime,
      feedback: preset.feedback,
      wet: preset.delayWet,
    });
    Sample.phaser = new Tone.Phaser({
      frequency: preset.phaser_frequency,
      octaves: preset.octaves,
      wet: preset.phaser_wet,
    });
  }
  static async setPreset() {
    let preset_res = await Axios.get("http://localhost:9000/presets/curr");
    Sample.Preset = preset_res.data;
    Sample.chain = ["delay", "reverb", "filter", "phaser", "compressor"];
    Sample.initObjects();
  }
  static updatePreset(attr, val, parent) {
    Sample.Preset[attr] = val;
    if (parent === "output"  ) parent = "pan"
    if (parent === "envelope") return;
    if (parent === "grains") parent = "Player";
    if (attr.includes("wet")) attr = "wet";
    if (attr.includes("frequency")) attr = "frequency";
    let json = {};
    json[attr] = val;
    Sample[parent].set(json);
  }
  static async setPlayer() {
    let preset = Sample.Preset;
    Sample.Player = await loadPlayer(
      "cropped",
      preset.grain_size,
      preset.overlap,
      preset.reverse
    );
    let buffer = Sample.Player.buffer;
    Sample.sample_duration = Math.floor(buffer.duration);
  }
  static disconnectSampler() {
    Sample.isSampler = false;
    Sample.sampler.disconnect()
  }
  static setSampler() {
    Sample.gain.set({ gain: Sample.Preset.gain });
    Sample.sampler = new Tone.Sampler({
      urls: {
        A1: "http://localhost:9000/audio/cropped",
      },
      release: Sample.Preset.release,
    });
    var chain = Sample.chain.map((x) => Sample[x]);
    Sample.sampler.chain(Sample.pan, ...chain, Sample.gain);
    Tone.loaded().then(() => {
      Sample.isSampler = true;
    });
  }
  static setSliderStart(val) {
    Sample.slider_start = val;
  }
  static setSliderStop(val) {
    Sample.slider_stop = val;
  }
  static async play() {
    if (Sample.isSampler) {
      var chain = Sample.chain.map((x) => Sample[x]);
      Sample.sampler.chain(Sample.pan, ...chain, Sample.gain);
      return;
    }
    if (Tone.Transport.state !== "stopped") {
      Sample.loop.cancel();
    }
    var chain = Sample.chain.map((x) => Sample[x]);
    let preset = Sample.Preset;
    const duration = preset.grain_size + preset.delay;
    let player = Sample.Player;
    Sample.grain = player.chain(Sample.pan, ...chain, Sample.gain);
    Sample.loop = new Tone.Loop(function (time) {
      Sample.offset = randomOffset(Sample.sample_duration, preset.grain_size);
      Sample.grain.start(time, Sample.offset, duration);
      let volume = Sample.gain.gain;
      volume.rampTo(preset.gain, preset.attack, time);
      volume.rampTo(0, preset.release / 2, time + preset.release);
    }, duration);
    Sample.loop.start(0);
    Tone.Transport.start("+0.1");
  }
  static getOffset() {
    this.offset_per = Sample.offset / Sample.sample_duration;
    this.slider_interval = Sample.slider_stop - Sample.slider_start;
    this.line_pos =
      Sample.slider_start + Sample.slider_interval * this.offset_per;
    return this.line_pos;
  }
}
export { loadPlayer, Sample };

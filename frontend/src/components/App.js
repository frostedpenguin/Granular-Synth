import "./stylesheets/App.css";
import Controllers from "./Controllers";
import AudioInterface from "./AudioInterface";
import "bootstrap/dist/css/bootstrap.css";
import Stack from "react-bootstrap/Stack";
import { useEffect } from "react";
import { Sample } from "../synth_module/createSample";
import Axios from "axios";
function App() {
  useEffect(() => {
    Axios.get("http://localhost:9000/presets/init");
    Sample.setPreset()
  });
  return (
    <Stack className="MainWindow" gap={4}>
      <AudioInterface></AudioInterface>
      <Controllers></Controllers>
    </Stack>
  );
}
export default App;

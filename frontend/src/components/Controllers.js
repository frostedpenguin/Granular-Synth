import "bootstrap/dist/css/bootstrap.css";
import './stylesheets/knobs.css'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import KnobCluster from "./KnobCluster";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Bus from "./bus";
export default function Controllers() {
  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <KnobCluster name="reverb"></KnobCluster>
          <KnobCluster name="output"></KnobCluster>
        </Col>
        <Col md={3}>
          <KnobCluster name="grains"></KnobCluster>
          <KnobCluster name="envelope"></KnobCluster>
        </Col>
        <Col xs={2}>
          <KnobCluster name="filter"></KnobCluster>
          <KnobCluster name="compressor"></KnobCluster>
        </Col>
        <Col md={3}>
          <KnobCluster name="delay"></KnobCluster>
          <KnobCluster name="phaser"></KnobCluster>
        </Col>
        <Col xs={2}>
    <div className="clusterWrapper" style={{height:"25vh"}}>
    <h3>Bus</h3>
    <div className="flexWrap" style={{height:"34vh"}}>
    <DndProvider backend={HTML5Backend}>
    <Bus />
    </DndProvider>
    </div>
    </div>
        </Col>
      </Row>
    </Container>
  );
}

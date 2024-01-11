import "./style.css";
import { ZoomableScatterplot } from "./exp-1.ts";
import { ZoomableScatterplot as ZoomableScatterplot2 } from "./exp-2.ts";
import { ZoomableScatterplot as ZoomableScatterplot3 } from "./exp-3.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Minimal PIXI.js Plots</h1>
    <p>Experiment 1: Draw once, then stretch to zoom</p>
    <div id="plot1" style="width:800px;height:150px;outline: 1px solid black"></div>
    <p>Experiment 2: Redraw at every frame</p>
    <div id="plot2" style="width:800px;height:150px;outline: 1px solid black"></div>
    <p>Experiment 3: Zoom using D3</p>
    <div id="plot3" style="width:800px;height:150px;outline: 1px solid black"></div>
  </div>
`;

const container = document.querySelector<HTMLDivElement>("#plot1")!;
new ZoomableScatterplot(800, 150, container);
const container2 = document.querySelector<HTMLDivElement>("#plot2")!;
new ZoomableScatterplot2(800, 150, container2);
const container3 = document.querySelector<HTMLDivElement>("#plot3")!;
new ZoomableScatterplot3(800, 150, container3);

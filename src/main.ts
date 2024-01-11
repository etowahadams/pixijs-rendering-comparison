import "./style.css";
import { ZoomableScatterplot } from "./exp-1.ts";
import { ZoomableScatterplot as ZoomableScatterplot2 } from "./exp-2.ts";
import { ZoomableScatterplot as ZoomableScatterplot3 } from "./exp-3.ts";
import { generateRandomData } from "./utils.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Minimal PIXI.js Plots</h1>
    <p>Experiment 1: Draw once, then stretch to zoom</p>
    <div id="plot1" style="width:400px;height:400px;outline: 1px solid black"></div>
    <p>Experiment 2: Redraw at every frame</p>
    <div id="plot2" style="width:400px;height:400px;outline: 1px solid black"></div>
    <p>Experiment 3: Zoom using D3</p>
    <div id="plot3" style="width:400px;height:400px;outline: 1px solid black"></div>
  </div>
`;

const container = document.querySelector<HTMLDivElement>("#plot1")!;
const data = generateRandomData(10000, 4000, 4000);
new ZoomableScatterplot(data, 400, 400, container);
const container2 = document.querySelector<HTMLDivElement>("#plot2")!;
new ZoomableScatterplot2(data, 400, 400, container2);
const container3 = document.querySelector<HTMLDivElement>("#plot3")!;
new ZoomableScatterplot3(data, 400, 400, container3);

import "./style.css";
import { ZoomableScatterplot } from "./exp-1.ts";
import { ZoomableScatterplot as ZoomableScatterplot2 } from "./exp-2.ts";
import { ZoomableScatterplot as ZoomableScatterplot3 } from "./exp-3.ts";
import { generateRandomData } from "./utils.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Minimal PIXI.js Plots</h1>
    <div class="card">
      <div class="card-left">
        <p>Experiment 1: Draw everything on the same Graphics object</p>
        <p>Zoom by scaling the Graphics object, and pan by changing the x and y position of the Graphics object.</p>
      </div>
      <div class="card-right">
        <div id="plot1" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p>Experiment 2: Redraw at every frame</p>
      </div>
      <div class="card-right">
        <div id="plot2" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p>Experiment 3: Zoom using D3</p>
      </div>
      <div class="card-right">
        <div id="plot3" class="plot"></div>
      </div>
    </div>
`;

const container = document.querySelector<HTMLDivElement>("#plot1")!;
const data = generateRandomData(10000, 4000, 4000);
new ZoomableScatterplot(data, 400, 300, container);
const container2 = document.querySelector<HTMLDivElement>("#plot2")!;
new ZoomableScatterplot2(data, 400, 300, container2);
const container3 = document.querySelector<HTMLDivElement>("#plot3")!;
new ZoomableScatterplot3(data, 400, 300, container3);

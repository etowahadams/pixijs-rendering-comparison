import "./style.css";
import { ZoomableScatterplot } from "./exp-1.ts";
import { ZoomableScatterplot as ZoomableScatterplot2 } from "./exp-2.ts";
import { ZoomableScatterplot as ZoomableScatterplot3 } from "./exp-3.ts";
import { ZoomableAxis } from "./axis.ts";
import { ZoomableScatterplot as ZoomableScatterplot4 } from "./exp-5.ts";
import { generateRandomData } from "./utils.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Minimal PIXI.js Plots</h1>
    <div class="card">
      <div class="card-left">
        <p>Let's make a scatterplot with PIXI.js</p>
        <p>Experiment 1: Draw everything on the same Graphics object</p>
        <p>Zoom by scaling the Graphics object, and pan by changing the x and y position of the Graphics object.</p>
      </div>
      <div class="card-right">
        <div id="plot1" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p> What if we want the circles to remain the same size even when we zoom in?</p>
        <p>Experiment 2: Redraw at every frame</p>
      </div>
      <div class="card-right">
        <div id="plot2" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p>Can we use d3-zoom and d3-scale to simplify the implementation?</p>
        <p>Experiment 3: D3 + PixiJS</p>
      </div>
      <div class="card-right">
        <div id="plot3" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p>Can we use d3-zoom and d3-scale to simplify the implementation?</p>
        <p>Experiment 5</p>
      </div>
      <div class="card-right">
        <div id="plot4" class="plot"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-left">
        <p>Can we use d3-zoom and d3-scale to simplify the implementation?</p>
        <p>Experiment 3: D3 + PixiJS</p>
      </div>
      <div class="card-right">
      <div id="axis1" class="plot"></div>
      </div>
    </div>
`;

const container = document.querySelector<HTMLDivElement>("#plot1")!;
const data = generateRandomData(100000, 4000, 4000);
// const data = [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 200, y: 200 }, { x: 300, y: 300 }];
new ZoomableScatterplot(data, 400, 300, container);
const container2 = document.querySelector<HTMLDivElement>("#plot2")!;
new ZoomableScatterplot2(data, 400, 300, container2);
const container3 = document.querySelector<HTMLDivElement>("#plot3")!;
new ZoomableScatterplot3(data, 400, 300, container3);
const container4 = document.querySelector<HTMLDivElement>("#plot4")!;
new ZoomableScatterplot4(data, 400, 300, container4);

const container5 = document.querySelector<HTMLDivElement>("#axis1")!;
new ZoomableAxis([0, 400], 400, 300, container5);
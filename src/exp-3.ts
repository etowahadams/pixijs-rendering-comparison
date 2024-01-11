import * as PIXI from 'pixi.js';
import { generateRandomData } from './utils';
import { scaleLinear, type ScaleLinear } from 'd3-scale';
import { zoom, D3ZoomEvent } from 'd3-zoom';
import { select } from 'd3-selection';

export class ZoomableScatterplot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private pBase: PIXI.Graphics;
  private data: { x: number; y: number }[] = [];
  private xScale: ScaleLinear<number, number>;

  constructor(width: number, height: number, container: HTMLDivElement) {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      width,
      height,
      antialias: true,
      view: document.createElement("canvas"),
      backgroundColor: 0xffffff,
    });
    container.appendChild(this.app.view);
    // This is where all the data points will be drawn
    this.pBase = new PIXI.Graphics();
    // Add the plot to the stage
    this.app.stage.addChild(this.pBase);
    // Initialize the xScale
    this.xScale = scaleLinear();

    // Attach zoom behavior to the canvas.
    const zoomBehavior = zoom<HTMLCanvasElement, unknown>().on('zoom', this.zoomed.bind(this));
    select<HTMLCanvasElement, unknown>(this.app.view).call(zoomBehavior);

    this.data = generateRandomData(10000); // You can specify the number of points you want
    this.drawData();
    
  }

  private drawData(): void {
    // Remove all of the drawn points
    this.pBase.clear();
    // Draw the points again
    this.data.forEach((point) => {
      this.pBase.beginFill(0x0000ff); // Change color to blue (0x0000ff)
      this.pBase.drawCircle(this.xScale(point.x), point.y, 5);
      this.pBase.endFill();
    });
  }

  private zoomed(event: D3ZoomEvent<HTMLCanvasElement, unknown>): void {
    const transform = event.transform;
    this.xScale = transform.rescaleX(scaleLinear());
    // Redraw the data with the updated zoom factor
    this.drawData();
  }
}

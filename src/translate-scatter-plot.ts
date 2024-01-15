import * as PIXI from "pixi.js";
import { scaleLinear, type ScaleLinear } from "d3-scale";
import { zoom, D3ZoomEvent } from "d3-zoom";
import { select } from "d3-selection";

// Default d3 zoom feels slow so we use this instead
// https://d3js.org/d3-zoom#zoom_wheelDelta
function wheelDelta(event: WheelEvent) {
  const defaultMultiplier = 5;
  return (
    -event.deltaY *
    (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
    (event.ctrlKey ? 10 : defaultMultiplier)
  );
}

export class TranslateScatterPlot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private pBase: PIXI.Graphics;
  private data: { x: number; y: number }[] = [];
  private xScale: ScaleLinear<number, number> = scaleLinear();
  private yScale: ScaleLinear<number, number> = scaleLinear();
  private circles: PIXI.Graphics[] = [];

  constructor(
    data: { x: number; y: number }[],
    width: number,
    height: number,
    container: HTMLDivElement,
    fps: (fps: number) => void
  ) {
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

    // Attach zoom behavior to the canvas.
    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .wheelDelta(wheelDelta)
      .on("zoom", this.zoomed.bind(this));
    select<HTMLCanvasElement, unknown>(this.app.view).call(zoomBehavior);

    this.data = data; // You can specify the number of points you want
    this.createCircles();
    this.drawData();
    // Report the FPS
    this.app.ticker.add(() => {
      fps(this.app.ticker.FPS); 
    });
  }

  private createCircles(): void {
    this.circles = this.data.map(() => {
      const circle = new PIXI.Graphics();
      circle.beginFill(0x0000ff); // Change color to blue (0x0000ff)
      circle.drawCircle(0, 0, 5);
      circle.endFill();
      this.pBase.addChild(circle);
      return circle;
    });
  }

  private drawData(): void {
    // Draw the points again
    this.data.forEach((point, i) => {
      const scaledX = this.xScale(point.x);
      const scaledY = this.yScale(point.y);
      if (!this.isPointVisisble(scaledX, scaledY)) {
        this.circles[i].visible = false;
        return;
      }
      this.circles[i].visible = true;
      this.circles[i].position.set(scaledX, scaledY);
    });
  }

  private isPointVisisble(x: number, y: number): boolean {
    return (
      x >= 0 && x <= this.app.view.width && y >= 0 && y <= this.app.view.height
    );
  }

  private zoomed(event: D3ZoomEvent<HTMLCanvasElement, unknown>): void {
    const transform = event.transform;
    this.xScale = transform.rescaleX(scaleLinear());
    this.yScale = transform.rescaleY(scaleLinear());
    // Redraw the data using the updated scales
    this.drawData();
  }

  public scaleTo(scale: number, duration?: number): void {
    const zoomTime = duration || 1500;
    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .wheelDelta(wheelDelta)
      .on("zoom", this.zoomed.bind(this));
  
    const canvasElement = this.app.view;
  
    select<HTMLCanvasElement, unknown>(canvasElement).transition().duration(zoomTime).call(zoomBehavior.scaleTo, scale);
  }
}

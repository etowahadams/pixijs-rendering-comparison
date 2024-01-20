import * as PIXI from "pixi.js";
import { scaleLinear, type ScaleLinear } from "d3-scale";
import { zoom, D3ZoomEvent } from "d3-zoom";
import { select } from "d3-selection";

// temporary fix https://stackoverflow.com/a/54020925
// @types/d3-select does not have the right version of d3-transition
import { transition as d3Transition } from 'd3-transition';
import { Data } from "./utils";
select.prototype.transition = d3Transition;


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

const generateCircleTexture = (renderer: PIXI.IRenderer<HTMLCanvasElement>, radius: number) => {
  const tileSize = radius * 3;
  const renderTexture = PIXI.RenderTexture.create({
    height: tileSize,
    width: tileSize,
  });

  const circle = new PIXI.Graphics();
  circle.lineStyle(1, 0x000000);
  circle.beginFill(0xffffff); // Change the fill color to white
  circle.drawCircle(tileSize / 2, tileSize / 2, radius);
  circle.endFill();

  renderer.render(circle, { renderTexture });

  return renderTexture;
};

export class TextureScatterPlot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private pBase: PIXI.Graphics;
  private data: Data[] = [];
  private xScale: ScaleLinear<number, number> = scaleLinear();
  private yScale: ScaleLinear<number, number> = scaleLinear();
  private circles: PIXI.Sprite[] = [];

  constructor(
    data: Data[],
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

    this.app.ticker.add(() => {
      fps(this.app.ticker.FPS); 
    });
  }

  private createCircles(): void {
    const multiplier = 2;
    const size = 5; // in practice this should be the max circle size in the data
    const circleTexture = generateCircleTexture(this.app.renderer, size * multiplier );
    this.circles = this.data.map((point) => {
      const circle = new PIXI.Sprite(circleTexture);
      const color = new PIXI.Color(point.color);
      circle.tint = color; // change the color
      circle.anchor.set(0.5);
      circle.scale.set((point.size / size) / multiplier);
      circle.position.x = point.x;
      circle.position.y = point.y;
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
      x >= -10 && x <= this.app.view.width && y >= -10 && y <= this.app.view.height + 10
    );
  }

  private zoomed(event: D3ZoomEvent<HTMLCanvasElement, unknown>): void {
    const transform = event.transform;
    this.xScale = transform.rescaleX(scaleLinear());
    this.yScale = transform.rescaleY(scaleLinear());
    // Redraw the data using the updated scales
    this.drawData();
  }

  public scaleTo(scale: number, duration?: number): Promise<void> {
    const zoomTime = duration || 1500;
    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .wheelDelta(wheelDelta)
      .on("zoom", this.zoomed.bind(this));
  
    const canvasElement = this.app.view;
  
    select<HTMLCanvasElement, unknown>(canvasElement).transition().duration(zoomTime).call(zoomBehavior.scaleTo, scale);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, zoomTime);
    });
  }

  public destroy(): void {
    this.app.destroy();
  }
}

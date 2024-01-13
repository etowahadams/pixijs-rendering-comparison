import * as PIXI from "pixi.js";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { zoom, D3ZoomEvent } from "d3-zoom";
import { select } from "d3-selection";

// Default d3 zoom feels slow, so we use this instead
function wheelDelta(event: WheelEvent) {
  const defaultMultiplier = 5;
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : defaultMultiplier);
}

export class ZoomableAxis {
  private app: PIXI.Application<HTMLCanvasElement>;
  private pAxisLine = new PIXI.Graphics();
  private xScale: ScaleLinear<number, number> = scaleLinear();
  private range: [number, number] = [0, 0];
  private pTicks = new PIXI.Graphics();

  constructor(
    range: [number, number],
    width: number,
    height: number,
    container: HTMLDivElement
  ) {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      width,
      height,
      antialias: true,
      view: document.createElement("canvas"),
      backgroundColor: 0xffffff,
    });
    container.appendChild(this.app.view);

    this.app.stage.addChild(this.pAxisLine);
    this.app.stage.addChild(this.pTicks);


    const zoomBehavior = zoom<HTMLCanvasElement, unknown>().wheelDelta(wheelDelta).on(
      "zoom",
      this.zoomed.bind(this)
    );
    select<HTMLCanvasElement, unknown>(this.app.view).call(zoomBehavior);
    this.range = range;
    this.xScale.domain(this.range).range([0, this.app.view.width]);
    this.drawAxisLine();
    this.drawTicks();
  }

  private drawTicks(): void {
    // Draw ticks based on the xScale
    const ticks = this.xScale.ticks();
    console.warn(ticks)
    this.pTicks.clear();
    for (const tick of ticks) {
      const xPosition = this.xScale(tick);
      this.pTicks.beginFill(0x0000ff); // Change color to blue (0x0000ff)
      this.pTicks.drawCircle(xPosition, this.app.view.height / 2, 5);
      this.pTicks.endFill();
    }
  }

  /**
   * Draws the axis line. This needs to only happen once. 
   */
  private drawAxisLine(): void {
    this.pAxisLine.clear();
    this.pAxisLine.lineStyle(2, 0x000000);
    this.pAxisLine.moveTo(0, this.app.view.height / 2);
    this.pAxisLine.lineTo(this.app.view.width, this.app.view.height / 2);
  }

  private zoomed(event: D3ZoomEvent<HTMLCanvasElement, unknown>): void {
    const transform = event.transform;
    this.xScale = transform.rescaleX(scaleLinear().domain(this.range).range([0, this.app.view.width]));
    this.drawTicks();
  }
}

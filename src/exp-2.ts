import * as PIXI from "pixi.js";
import { generateRandomData } from "./utils";


function translateAndScale(position: number, center: number, scale: number) {
  // see https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
  const translate = position - center;
  const scaleTranslate = translate * scale;
  const positionBack = scaleTranslate + center;
  return positionBack;
}

export class ZoomableScatterplot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private isDragging: boolean = false;
  private dragStart: { x: number; y: number } = { x: 0, y: 0 };
  private pBase: PIXI.Graphics;
  private data: { x: number; y: number }[] = [];
  private zoomFactor: number = 1.0;

  constructor(
    data: { x: number; y: number }[],
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

    this.pBase = new PIXI.Graphics();
    this.app.stage.addChild(this.pBase);

    this.data = structuredClone(data); // You can specify the number of points you want
    this.drawData({ x: 0, y: 0 });

    // Enable interaction for zooming and panning
    this.app.view.addEventListener("wheel", this.handleZoom.bind(this));
    this.app.view.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.app.view.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.app.view.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
  }

  private isPointVisible(x: number, y: number): boolean {
    const localBox = this.pBase.toLocal(this.app.renderer.screen);
    return (
      x >= localBox.x &&
      x <= localBox.x + 400 &&
      y >= localBox.y &&
      y <= localBox.y + 400
    )
  }

  private drawData(mousePosition?: { x: number; y: number }): void {
    this.pBase.clear();
    // Plot data with updated positions based on zoom level
    this.data.forEach((point) => {
      if (mousePosition) {
        point.x = translateAndScale(
          point.x,
          mousePosition.x,
          this.zoomFactor
        );
        point.y = translateAndScale(
          point.y,
          mousePosition.y,
          this.zoomFactor
        );
      }
      if (this.isPointVisible(point.x, point.y)) {
        this.pBase.beginFill(0x0000ff); 
        this.pBase.drawCircle(point.x, point.y, 5);
        this.pBase.endFill();
      }
    });
  }

  private handleZoom(event: WheelEvent): void {
    // Check if the mouse is over the plot
    const isMouseOverPlot = this.isMouseOverPlot(event.clientX, event.clientY);

    if (isMouseOverPlot) {
      event.preventDefault(); // Prevent default behavior (page scrolling)

      const delta = event.deltaY;
      const scaleMultiplier = 0.05;

      // Calculate the scaling origin based on mouse position
      const mousePosition = {
        x: event.clientX - this.app.view.getBoundingClientRect().left,
        y: event.clientY - this.app.view.getBoundingClientRect().top,
      };

      // This is where the mouse is relative to pBase
      const localMousePosition = this.pBase.toLocal(mousePosition);

      this.zoomFactor = 1 + (delta > 0 ? -scaleMultiplier : scaleMultiplier);

      this.drawData(localMousePosition);
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    // Check if the mouse is over the plot
    const isMouseOverPlot = this.isMouseOverPlot(event.clientX, event.clientY);

    if (isMouseOverPlot) {
      this.isDragging = true;
      this.dragStart = {x: event.clientX, y: event.clientY};
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStart.x;
      const deltaY = event.clientY - this.dragStart.y;
      this.pBase.x += deltaX;
      this.pBase.y += deltaY;
      this.dragStart.x = event.clientX;
      this.dragStart.y = event.clientY;
      this.drawData();
    }
  }

  private isMouseOverPlot(x: number, y: number): boolean {
    const plotBounds = this.app.view.getBoundingClientRect();
    return (
      x >= plotBounds.left &&
      x <= plotBounds.right &&
      y >= plotBounds.top &&
      y <= plotBounds.bottom
    );
  }
}

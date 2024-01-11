import * as PIXI from "pixi.js";
import { generateRandomData } from "./utils";

export class ZoomableScatterplot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private isDragging: boolean = false;
  private dragStartX: number = 0;

  private verticalBar: PIXI.Graphics;
  private pBase: PIXI.Graphics;
  private data: { x: number; y: number }[] = [];
  private zoomFactor: number = 1.0;

  constructor(width: number, height: number, container: HTMLDivElement) {
    this.app = new PIXI.Application<HTMLCanvasElement>({
      width,
      height,
      antialias: true,
      view: document.createElement("canvas"),
      backgroundColor: 0xffffff,
    });

    container.appendChild(this.app.view);

    this.verticalBar = new PIXI.Graphics();
    this.app.stage.addChild(this.verticalBar);
    this.pBase = new PIXI.Graphics();
    this.app.stage.addChild(this.pBase);

    this.data = generateRandomData(10000); // You can specify the number of points you want
    this.drawData(0);

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

  private drawData(mousepositionX: number): void {
    this.pBase.clear();
    // Plot data with updated positions based on zoom level
    this.data.forEach((point) => {
      point.x = this.calculateUpdatedX(point.x, mousepositionX);
      this.pBase.beginFill(0x0000ff); // Change color to blue (0x0000ff)
      this.pBase.drawCircle(point.x, point.y, 5,);
      this.pBase.endFill();
    });
  }

  private calculateUpdatedX(originalX: number, mouseX: number): number {
    // see https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate
    const translate = (originalX) - (mouseX);
    const scale = translate * (this.zoomFactor);
    return scale + (mouseX);
  }

  private handleZoom(event: WheelEvent): void {
    // Check if the mouse is over the plot
    const isMouseOverPlot = this.isPointOverPlot(event.clientX, event.clientY);

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

      this.drawData(localMousePosition.x);
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    // Check if the mouse is over the plot
    const isMouseOverPlot = this.isPointOverPlot(event.clientX, event.clientY);

    if (isMouseOverPlot) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStartX;
      this.pBase.x += deltaX;
      this.dragStartX = event.clientX;
    }

    // Update the vertical bar position to follow the mouse
    this.updateVerticalBarPosition(event);
  }

  private isPointOverPlot(x: number, y: number): boolean {
    const plotBounds = this.app.view.getBoundingClientRect();
    return (
      x >= plotBounds.left &&
      x <= plotBounds.right &&
      y >= plotBounds.top &&
      y <= plotBounds.bottom
    );
  }

  private updateVerticalBarPosition(event: MouseEvent): void {
    const mousePosition = {
      x: event.clientX - this.app.view.getBoundingClientRect().left,
      y: event.clientY - this.app.view.getBoundingClientRect().top,
    };
    const localMousePosition = this.app.stage.toLocal(mousePosition);
    // console.warn(this.pBase.toLocal(mousePosition).x)
    // this.mousePosition = localMousePosition;
    this.verticalBar.clear();
    this.verticalBar.lineStyle(0.5, 0x000000, 1); // Set color to black
    this.verticalBar.moveTo(localMousePosition.x, 0);
    this.verticalBar.lineTo(localMousePosition.x, this.app.renderer.height);
  }
}

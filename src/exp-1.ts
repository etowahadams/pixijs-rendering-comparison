import * as PIXI from "pixi.js";
export class ZoomableScatterplot {
  private app: PIXI.Application<HTMLCanvasElement>;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private pBase: PIXI.Graphics;

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

    const graphics = new PIXI.Graphics();
    // Plot initial data
    data.forEach((point) => {
      graphics.beginFill(0x0000ff); // Change color to blue (0x0000ff)
      graphics.drawCircle(point.x, point.y, 5);
      graphics.endFill();
    });

    this.pBase = new PIXI.Graphics();
    this.pBase.addChild(graphics);
    this.app.stage.addChild(this.pBase);

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

      const maxZoomOut = 0.001;
      const zoomFactor = 1 + (delta > 0 ? -scaleMultiplier : scaleMultiplier);

      // Apply smooth zooming
      const newScaleX = this.pBase.scale.x * zoomFactor;
      const newScaleY = this.pBase.scale.x * zoomFactor;
      this.pBase.scale.x = Math.max(newScaleX, maxZoomOut);
      this.pBase.scale.y = Math.max(newScaleY, maxZoomOut);

      // Adjust the position to keep the mouse at the same point after zoom
      const newMousePosition = this.pBase.toGlobal(localMousePosition);
      this.pBase.x += mousePosition.x - newMousePosition.x;
      this.pBase.y += mousePosition.y - newMousePosition.y;
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    // Check if the mouse is over the plot
    const isMouseOverPlot = this.isMouseOverPlot(event.clientX, event.clientY);

    if (isMouseOverPlot) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;
      this.pBase.x += deltaX;
      this.pBase.y += deltaY;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
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

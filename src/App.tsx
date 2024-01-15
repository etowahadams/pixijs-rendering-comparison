import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { RedrawScatterPlot } from "./redraw-scatter-plot";
import { TranslateScatterPlot } from "./translate-scatter-plot";
import { TextureScatterPlot } from "./texture-scatter-plot";
import { generateRandomData } from "./utils";

const plots = [
  {
    label: "Make texture from circle and translate",
    content: TextureScatterPlot,
  },
  { label: "Translate drawn circles", content: TranslateScatterPlot },
  { label: "Redraw circles every frame", content: RedrawScatterPlot },
];

const dataSizes = [16000, 64000, 128000];

function autoZoom(plot: { scaleTo: (scale: number) => void }): void {
  const zoomInOut = (scale: number): void => {
    plot.scaleTo(scale);
    setTimeout(() => {
      zoomInOut(scale === 1 ? 0.05 : 1);
    }, 1500);
  };

  zoomInOut(0.05);
}

function App() {
  const [currentPlot, setCurrentPlot] = useState(0);
  const [numCircles, setNumCircles] = useState(16000);
  const [fps, setFps] = useState(0);

  const data = useMemo(
    () =>
      generateRandomData({
        count: numCircles,
        maxX: 4000,
        maxY: 4000,
        startX: -2000,
        startY: -2000,
      }),
    [numCircles]
  );

  

  useEffect(() => {
    const plotElement = document.getElementById("plot") as HTMLDivElement;
    plotElement.innerHTML = "";
    const plot = new plots[currentPlot].content(data, 400, 300, plotElement, setFps);
    autoZoom(plot);
  }, [currentPlot, numCircles]);

  return (
    <>
      <div></div>
      <h1>Minimal Pixi Plots</h1>
      <div className="card">
        {plots.map((plot, i) => {
          return (
            <button
              key={i}
              className={i === currentPlot ? "active" : ""}
              onClick={() => {
                setCurrentPlot(i);
              }}
            >
              {plot.label}
            </button>
          );
        })}
      </div>
      <div>
        {dataSizes.map((num, i) => {
          return (
            <button
              key={i}
              className={num === numCircles ? "active" : ""}
              onClick={() => {
                setNumCircles(num);
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
        <div>{fps.toFixed(0)} fps</div>
      <div className="card" id="plot"></div>
    </>
  );
}

export default App;

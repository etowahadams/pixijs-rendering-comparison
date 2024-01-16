import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { RedrawScatterPlot } from "./redraw-scatter-plot";
import { TranslateScatterPlot } from "./translate-scatter-plot";
import { TextureScatterPlot } from "./texture-scatter-plot";
import { generateRandomData } from "./utils";

const plots = [
  {
    label: "Translate Sprites",
    description:
      "Circles are instances of the same Sprite. On zoom, the Sprites get translated.",
    content: TextureScatterPlot,
  },
  {
    label: "Translate Graphics",
    description:
      "A Graphics object is created for each circle. On zoom, the Graphics objects get translated.",
    content: TranslateScatterPlot,
  },
  {
    label: "Redraw Graphics every frame",
    description:
      "All circles are drawn to single a Graphics object. On zoom, the Graphics object is cleared and new circles are drawn.",
    content: RedrawScatterPlot,
  },
];

const dataSizes = [4000, 16000, 64000, 128000];

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b) / arr.length;
}

function App() {
  const [currentPlot, setCurrentPlot] = useState(0);
  const [numCircles, setNumCircles] = useState(4000);
  const [fps, setFps] = useState(120);
  const [isRecordingMinFps, setIsRecordingMinFps] = useState(false);
  const plot = useRef<
    TextureScatterPlot | TranslateScatterPlot | RedrawScatterPlot
  >();
  const [minFps, setMinFps] = useState<number>();
  const recordedFps = useRef<number[]>([]);

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

  async function zoomLoop() {
    await plot.current?.scaleTo(0.05);
    setIsRecordingMinFps(true);
    await plot.current?.scaleTo(1);
    setIsRecordingMinFps(false);
  }

  useEffect(() => {
    recordedFps.current.push(fps);
    // Look at a window of the last 5 fps values
    if (recordedFps.current.length > 5) {
      recordedFps.current.shift();
    }
    const avgFps = avg(recordedFps.current);
    if (isRecordingMinFps && (minFps === undefined || avgFps < minFps)) {
      setMinFps(avgFps);
    }
  }, [fps, minFps, isRecordingMinFps]);

  useEffect(() => {
    // Cleanup the old plot to avoid memory leaks
    plot.current?.destroy();
    setMinFps(undefined);

    // Create the new plot 
    const plotElement = document.getElementById("plot") as HTMLDivElement;
    plotElement.innerHTML = "";
    const newPlot = new plots[currentPlot].content(
      data,
      500,
      500,
      plotElement,
      setFps
    );
    
    plot.current = newPlot;
    zoomLoop();
  }, [currentPlot, numCircles, data]);

  return (
    <>
      <div></div>
      <h1>Testing PixiJS Rendering</h1>
      <div className="card">
        <p className="label">Rendering strategy:</p>
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
      <div className="desc">{plots[currentPlot].description} </div>
      <div className="card">
        <p className="label">Number of points:</p>
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
      <div className="card">
        <div>
          Lowest FPS: <b>{minFps ? minFps.toFixed(0) : "..."}</b>, Current FPS:{" "}
          {recordedFps.current.length > 0 && avg(recordedFps.current).toFixed(0)}
        </div>
      </div>
      <div className="card" id="plot"></div>
    </>
  );
}

export default App;

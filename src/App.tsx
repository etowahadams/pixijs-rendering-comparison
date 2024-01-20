import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { RedrawScatterPlot } from "./redraw-scatter-plot";
import { TranslateScatterPlot } from "./translate-scatter-plot";
import { TextureScatterPlot } from "./texture-scatter-plot";
import { TextureUniqueScatterPlot } from "./texture-unique-scatter-plot";
import { Data, generateRandomData } from "./utils";

const plots = [
  {
    label: "Reuse Texture",
    description:
      "Circles are Sprites which all use the same Texture. On zoom, the Sprites get translated.",
    content: TextureScatterPlot,
  },
  {
    label: "Unique Textures",
    description:
      "Circles are Sprites which use different Textures. On zoom, the Sprites get translated.",
    content: TextureUniqueScatterPlot,
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

const circleStyles = [
   "different", "same"
]

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b) / arr.length;
}

function App() {
  const [currentPlot, setCurrentPlot] = useState(0);
  const [currentCircleStyle, setCurrentCircleStyle] = useState(0); // [0, 1];
  const [numCircles, setNumCircles] = useState(4000);
  const [fps, setFps] = useState(120);
  const [isRecordingMinFps, setIsRecordingMinFps] = useState(false);
  const plot = useRef<
    TextureScatterPlot | TextureUniqueScatterPlot | TranslateScatterPlot | RedrawScatterPlot
  >();
  const [minFps, setMinFps] = useState<number>();
  const lastFiveFps = useRef<number[]>([]);

  const data: Data[] = useMemo(
    () =>
      generateRandomData({
        count: numCircles,
        maxX: 4000,
        maxY: 4000,
        startX: -2000,
        startY: -2000,
        style: circleStyles[currentCircleStyle]
      }),
    [numCircles, currentCircleStyle]
  );

  async function zoomLoop() {
    await plot.current?.scaleTo(0.05);
    setIsRecordingMinFps(true);
    await plot.current?.scaleTo(1);
    setIsRecordingMinFps(false);
  }

  useEffect(() => {
    lastFiveFps.current.push(fps);
    // Look at a window of the last 5 fps values
    if (lastFiveFps.current.length > 5) {
      lastFiveFps.current.shift();
    }
    const avgFps = avg(lastFiveFps.current);
    if (isRecordingMinFps && (minFps === undefined || avgFps < minFps)) {
      setMinFps(avgFps);
    }
    // This dependency array is not ideal since fps will get added to recordedFps.current a few extra times
    // Minimal impact on accuracy though
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
      <div className="top-corner"><a href="https://github.com/etowahadams/pixijs-rendering-comparison">See on GitHub</a></div>
      <h1>Compare PixiJS Rendering</h1>
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
      <p className="label">Point style:</p>
        {circleStyles.map((style, i) => {
          return (
            <button
              key={i}
              className={i === currentCircleStyle ? "active" : ""}
              onClick={() => {
                setCurrentCircleStyle(i);
              }}
            >
              {style}
            </button>
          );
        })}

      </div>
      <div className="card">
        <div className="desc">
          Lowest FPS: <b>{minFps ? minFps.toFixed(0) : "..."}</b>, Current FPS:{" "}
          {lastFiveFps.current.length > 0 && Math.min(...lastFiveFps.current).toFixed(0)}
        </div>
      </div>
      <div className="card" id="plot"></div>
    </>
  );
}

export default App;

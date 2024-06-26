# PixiJS Rendering Comparison

Interactive data visualizations like scatterplots require efficient rendering of thousands of points. What is the most performant PixiJS rendering stratgy for rendering many different graphics objects?

This repository tests the performance of different rendering strategies for this task, using the [PixiJS](https://github.com/pixijs/pixijs) v7 and v8. 

Try the [live demo](https://etowahadams.github.io/pixijs-rendering-comparison/).

## Results

The minimum FPS for each rendering strategy is shown below. The benchmark was conducted in Chrome (Version 120) on a MacBook Pro (M2).
That PixiJS is highly optimized for rendering Sprites is clear from the results.

| Rendering Strategy                                                                                                                            | Description                                       | Min FPS @ 4,000 points | Min FPS @ 16,000 points | Min FPS @ 64,000 points | Min FPS @ 128,000 points |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------- | ----------------------- | ----------------------- | ------------------------ |
| Same Texture, Translate ([source](https://github.com/etowahadams/pixijs-rendering-comparison/blob/main/src/texture-scatter-plot.ts))          | Every circle uses the same texture                | 120                    | 120                     | 24                      | 15                       |
| Unique Texture, Translate ([source](https://github.com/etowahadams/pixijs-rendering-comparison/blob/main/src/texture-unique-scatter-plot.ts)) | Every circle is a unique texture                  | 120                    | 60                      | 13                      | 2                        |
| Unique Graphics, Translate ([source](https://github.com/etowahadams/pixijs-rendering-comparison/blob/main/src/translate-scatter-plot.ts))     | Every circle is a Graphics object                 | 60                     | 30                      | 3                       | 0                        |
| Redraw Graphics ([source](https://github.com/etowahadams/pixijs-rendering-comparison/blob/main/src/redraw-scatter-plot.ts))                   | All circles get drawn to the same Graphics object | 22                     | 5                       | 1                       | 0                        |

See [here](https://benchmarks.slaylines.io/) for a comparison of different 2D rendering engines.

## Local development

```
pnpm install
pnpm run dev
```

## How this was made

The repository was scaffolded using `pnpm create vite minimal-pixi-plots --template vanilla-ts`

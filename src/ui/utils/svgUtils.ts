import { Graphics, GraphicsPath } from "pixi.js";
import SVGPathCommander, { PathArray } from "svg-path-commander";

export function transformCoordsFromSvg(svg: string) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, "image/svg+xml");
  const polygon = svgDoc.querySelector("polygon")?.getAttribute("points");
  if (polygon) {
    const coords = [...polygon.matchAll(/\d+\.?\d*/g)].map((s) => Number(s));
    if (coords.length !== 8) return null;
    const [x0, y0, x1, y1, x2, y2, x3, y3] = coords;
    return { x0, y0, x1, y1, x2, y2, x3, y3 };
  } else return null;
}

export function maskFromSVG(svg: string | null) {
  if (!svg) return null;
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, "image/svg+xml");
  const path = svgDoc.querySelector("path")?.getAttribute("d");
  if (!path) {
    console.error("Mask SVG is missing <path> element");
    return null;
  }
  const segments = new SVGPathCommander(path).normalize().segments;
  const zFirstIndex = segments.findIndex((s) => s[0] === "Z");
  const firstPath = segments.slice(0, zFirstIndex + 1) as PathArray;
  const subPaths = segments.slice(zFirstIndex + 1) as PathArray;

  let mask = null;
  if (subPaths.length === 0) mask = new Graphics().svg(svg).fill("#000000");
  else if (firstPath.length === 0) console.error("Mask SVG <path> should be closed");
  else {
    mask = new Graphics();
    mask.path(new GraphicsPath(SVGPathCommander.pathToString(firstPath))).fill("#000000");
    mask.path(new GraphicsPath(SVGPathCommander.pathToString(subPaths))).cut();
  }
  return mask;
}

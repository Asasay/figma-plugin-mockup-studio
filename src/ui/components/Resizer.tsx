import { PLUGIN } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import { type CSSProperties, FC, useRef } from "react";

type Props = {
  style?: CSSProperties;
};

const SVG_SIZE = 16;

export const Resizer: FC<Props> = (props) => {
  const { style } = props;

  const svgRef = useRef<SVGSVGElement>(null);
  const isStretchingRef = useRef(false);

  return (
    <svg
      ref={svgRef}
      width={SVG_SIZE}
      height={SVG_SIZE}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        right: 1,
        bottom: 1,
        cursor: "nwse-resize",
        ...style,
      }}
      onPointerDown={(event) => {
        isStretchingRef.current = true;
        svgRef.current?.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (isStretchingRef.current) {
          UI_CHANNEL.emit(PLUGIN, "resizeWindow", [
            Math.floor(event.clientX + SVG_SIZE / 2),
            Math.floor(event.clientY + SVG_SIZE / 2),
          ]);
        }
      }}
      onPointerUp={(event) => {
        isStretchingRef.current = false;
        svgRef.current?.releasePointerCapture(event.pointerId);
      }}
    >
      <path d="M16 0V16H0L16 0Z" fill="white" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z" fill="#8C8C8C" />
    </svg>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

interface KenBurnsImageProps {
  src: string;
  direction: "in" | "out";
}

export const KenBurnsImage: React.FC<KenBurnsImageProps> = ({
  src,
  direction,
}) => {
  const frame = useCurrentFrame();

  const scale =
    direction === "in"
      ? interpolate(frame, [0, 150], [1, 1.15], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 150], [1.15, 1], {
          extrapolateRight: "clamp",
        });

  const translateX =
    direction === "in"
      ? interpolate(frame, [0, 150], [0, -20], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 150], [-20, 0], {
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

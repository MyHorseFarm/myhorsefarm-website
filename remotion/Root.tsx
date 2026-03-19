import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { AdVideo } from "./compositions/AdVideo";
import { VERTICAL, FPS, TOTAL_DURATION } from "./lib/constants";

const adVideoSchema = z.object({
  images: z.array(z.string()).min(1).max(4),
  headline: z.string(),
  description: z.string(),
  ctaText: z.string(),
  serviceName: z.string().optional(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AdVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={AdVideo as any}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={VERTICAL.width}
        height={VERTICAL.height}
        schema={adVideoSchema}
        defaultProps={{
          images: ["https://placehold.co/1080x1920/689f38/ffffff?text=MHF"],
          headline: "Professional Junk Removal",
          description: "Fast, affordable cleanup for your property",
          ctaText: "Call Now!",
          serviceName: "Junk Removal",
        }}
      />
    </>
  );
};

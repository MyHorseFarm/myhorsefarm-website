import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KenBurnsImage } from "../components/KenBurnsImage";
import type { AdVideoProps } from "../lib/types";
import {
  INTRO_DURATION,
  SCENE_DURATION,
  OUTRO_DURATION,
  NUM_SCENES,
  MHF_GREEN,
  MHF_GREEN_DARK,
  MHF_GREEN_LIGHT,
  MHF_WHITE,
  MHF_BLACK,
  MHF_BG_DARK,
  FONT_BOLD,
  FONT_REGULAR,
  MHF_PHONE,
  MHF_WEBSITE,
  MHF_NAME,
} from "../lib/constants";

// ── Intro: Logo + Service Name ──
const Intro: React.FC<{ serviceName?: string }> = ({ serviceName }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [20, 35], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${MHF_GREEN_DARK} 0%, ${MHF_BG_DARK} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Green accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${MHF_GREEN_LIGHT}, ${MHF_GREEN})`,
          transform: `scaleX(${interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })})`,
          transformOrigin: "left",
        }}
      />

      {/* Logo circle */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: MHF_GREEN,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${logoScale})`,
          boxShadow: `0 0 60px ${MHF_GREEN}66`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 48,
            color: MHF_WHITE,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          MHF
        </span>
      </div>

      {/* Company name */}
      <div
        style={{
          marginTop: 30,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 52,
            color: MHF_WHITE,
            textAlign: "center",
            letterSpacing: 4,
          }}
        >
          {MHF_NAME.toUpperCase()}
        </div>
        {serviceName && (
          <div
            style={{
              fontFamily: FONT_REGULAR,
              fontSize: 36,
              color: MHF_GREEN_LIGHT,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            {serviceName}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene: Image + text overlay ──
const Scene: React.FC<{
  imageSrc: string;
  text: string;
  index: number;
}> = ({ imageSrc, text, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cross-fade
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [SCENE_DURATION - 15, SCENE_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Text animation
  const textScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <KenBurnsImage
        src={imageSrc}
        direction={index % 2 === 0 ? "in" : "out"}
      />

      {/* Dark gradient overlay for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)",
        }}
      />

      {/* Green accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: 60,
          width: 80,
          height: 5,
          backgroundColor: MHF_GREEN_LIGHT,
          transform: `scaleX(${interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          transformOrigin: "left",
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 60,
          right: 60,
          transform: `scale(${textScale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 48,
            color: MHF_WHITE,
            lineHeight: 1.3,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Outro: CTA ──
const Outro: React.FC<{ ctaText: string }> = ({ ctaText }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10 },
  });
  const phoneOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${MHF_GREEN_DARK} 0%, ${MHF_BG_DARK} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* CTA Button */}
      <div
        style={{
          transform: `scale(${buttonScale})`,
          padding: "28px 60px",
          background: `linear-gradient(135deg, ${MHF_GREEN} 0%, ${MHF_GREEN_LIGHT} 100%)`,
          borderRadius: 16,
          boxShadow: `0 8px 40px ${MHF_GREEN}66`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 44,
            color: MHF_WHITE,
            letterSpacing: 2,
          }}
        >
          {ctaText}
        </span>
      </div>

      {/* Phone + Website */}
      <div
        style={{
          marginTop: 50,
          opacity: phoneOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 42,
            color: MHF_WHITE,
          }}
        >
          {MHF_PHONE}
        </div>
        <div
          style={{
            fontFamily: FONT_REGULAR,
            fontSize: 32,
            color: MHF_GREEN_LIGHT,
            marginTop: 10,
          }}
        >
          {MHF_WEBSITE}
        </div>
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: `linear-gradient(90deg, ${MHF_GREEN_LIGHT}, ${MHF_GREEN})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Main Composition ──
export const AdVideo: React.FC<AdVideoProps> = ({
  images,
  headline,
  description,
  ctaText,
  serviceName,
}) => {
  // Cycle images if fewer than NUM_SCENES
  const sceneImages = Array.from(
    { length: NUM_SCENES },
    (_, i) => images[i % images.length]
  );

  // Split headline/description across scenes
  const sceneTexts = [headline, description, ctaText];

  return (
    <AbsoluteFill style={{ backgroundColor: MHF_BLACK }}>
      {/* Intro */}
      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro serviceName={serviceName} />
      </Sequence>

      {/* Image Scenes */}
      {sceneImages.map((img, i) => (
        <Sequence
          key={i}
          from={INTRO_DURATION + i * SCENE_DURATION}
          durationInFrames={SCENE_DURATION}
        >
          <Scene imageSrc={img} text={sceneTexts[i]} index={i} />
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence
        from={INTRO_DURATION + NUM_SCENES * SCENE_DURATION}
        durationInFrames={OUTRO_DURATION}
      >
        <Outro ctaText={ctaText} />
      </Sequence>
    </AbsoluteFill>
  );
};

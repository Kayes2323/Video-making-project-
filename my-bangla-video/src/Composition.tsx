import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansBengali";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["bengali", "latin"],
});

const FPS = 30;
const SCENE = 4 * FPS; // each scene = 4 seconds

const COLORS = {
  bgA: "#0f172a",
  bgB: "#1e3a8a",
  accent: "#fbbf24",
  green: "#10b981",
  red: "#f43f5e",
  text: "#f8fafc",
};

/** Animated gradient background with floating circles. */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 12 * FPS], [120, 200]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${COLORS.bgA}, ${COLORS.bgB})`,
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const size = 120 + i * 50;
        const x = 150 + i * 200 + Math.sin((frame + i * 40) / 40) * 40;
        const y = 120 + ((i * 97) % 480) + Math.cos((frame + i * 25) / 35) * 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 2 ? COLORS.accent : COLORS.green,
              opacity: 0.1,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Fade in at the start and out at the end of a scene. */
const useSceneOpacity = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 12, SCENE - 12, SCENE], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = useSceneOpacity();
  const words = ["আমাদের", "প্রথম", "বাংলা", "অ্যানিমেটেড", "ভিডিও"];

  const underline = interpolate(frame, [50, 85], [0, 100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 24,
          maxWidth: 1100,
          fontFamily,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.4,
          color: COLORS.text,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          return (
            <span
              key={w}
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})`,
                opacity: s,
                color: i === 2 ? COLORS.accent : COLORS.text,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 10,
          height: 8,
          width: `${underline * 6}px`,
          background: COLORS.accent,
          borderRadius: 4,
        }}
      />
    </AbsoluteFill>
  );
};

const CARDS = [
  { title: "শিখুন", sub: "নতুন কিছু জানুন", color: COLORS.green, icon: "📘" },
  { title: "দেখুন", sub: "ছবিতে বুঝে নিন", color: COLORS.accent, icon: "🎬" },
  { title: "বুঝুন", sub: "সহজ বাংলায়", color: COLORS.red, icon: "💡" },
];

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = useSceneOpacity();

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity }}
    >
      <div style={{ display: "flex", gap: 48, fontFamily }}>
        {CARDS.map((c, i) => {
          const s = spring({
            frame: frame - 10 - i * 12,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const float = Math.sin((frame + i * 20) / 18) * 8;
          return (
            <div
              key={c.title}
              style={{
                width: 330,
                padding: "48px 24px",
                borderRadius: 32,
                textAlign: "center",
                background: "rgba(255,255,255,0.08)",
                border: `3px solid ${c.color}`,
                transform: `translateY(${(1 - s) * 200 + float}px) scale(${s})`,
                opacity: s,
              }}
            >
              <div style={{ fontSize: 96 }}>{c.icon}</div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  color: c.color,
                  marginTop: 12,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 400,
                  color: COLORS.text,
                  marginTop: 12,
                }}
              >
                {c.sub}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frameOut = interpolate(frame, [0, 12, SCENE - 12, SCENE], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = spring({ frame, fps, config: { damping: 8, stiffness: 90 } });
  const sub = spring({ frame: frame - 25, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        opacity: frameOut,
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 800,
          color: COLORS.accent,
          transform: `scale(${pop})`,
        }}
      >
        ধন্যবাদ!
      </div>
      <div
        style={{
          fontSize: 48,
          color: COLORS.text,
          marginTop: 16,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 30}px)`,
        }}
      >
        পরবর্তী ভিডিওতে দেখা হবে
      </div>
    </AbsoluteFill>
  );
};

export const BanglaIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={SCENE}>
        <Scene1 />
      </Sequence>
      <Sequence from={SCENE} durationInFrames={SCENE}>
        <Scene2 />
      </Sequence>
      <Sequence from={SCENE * 2} durationInFrames={SCENE}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="BanglaIntro"
      component={BanglaIntro}
      durationInFrames={SCENE * 3}
      fps={FPS}
      width={1280}
      height={720}
    />
  );
};

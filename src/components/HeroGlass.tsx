import { lazy, Suspense, useEffect, useState } from "react";

const FlutedGlass = lazy(() =>
  import("@paper-design/shaders-react").then(({ FlutedGlass }) => ({ default: FlutedGlass })),
);

type GlassImage = {
  available: boolean;
  dataUrl: string;
};

function hasWebGL() {
  const canvas = document.createElement("canvas");

  try {
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function makeGlassPlate() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1220;

  const context = canvas.getContext("2d");
  if (!context) return "";

  context.fillStyle = "#0B1326";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const glow = context.createRadialGradient(830, 590, 20, 830, 590, 620);
  glow.addColorStop(0, "rgba(255, 107, 91, 0.30)");
  glow.addColorStop(0.38, "rgba(255, 107, 91, 0.14)");
  glow.addColorStop(1, "rgba(11, 19, 38, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

function FallbackGlass() {
  return <div className="hero-glass-fallback" style={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }} />;
}

export function HeroGlass() {
  const [glassImage, setGlassImage] = useState<GlassImage | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 1024px)");
    const updateGlass = () => {
      if (!motionQuery.matches) {
        setGlassImage({ available: false, dataUrl: "" });
        return;
      }

      try {
        const dataUrl = makeGlassPlate();
        setGlassImage({ available: Boolean(dataUrl) && hasWebGL(), dataUrl });
      } catch {
        setGlassImage({ available: false, dataUrl: "" });
      }
    };

    updateGlass();
    motionQuery.addEventListener("change", updateGlass);
    return () => motionQuery.removeEventListener("change", updateGlass);
  }, []);

  return (
    <div className="hero-glass-stage" aria-hidden="true">
      {glassImage?.available ? (
        <Suspense fallback={<FallbackGlass />}>
          <FlutedGlass
            className="hero-glass-canvas"
            image={glassImage.dataUrl}
            width="100%"
            height="100%"
            fit="cover"
            shape="lines"
            distortionShape="prism"
            size={0.24}
            angle={0}
            distortion={0.22}
            shift={0.02}
            blur={0.08}
            edges={0.16}
            shadows={0.18}
            highlights={0.14}
            speed={0}
          />
        </Suspense>
      ) : (
        <FallbackGlass />
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Stage, Sprite, withPixiApp } from "@pixi/react";
import { BlurFilter } from "pixi.js";

const BunnySprite = ({ app }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const tickerCallback = (delta) => setRotation((prev) => prev + 0.1 * delta);
    app.ticker.add(tickerCallback);

    return () => app.ticker.remove(tickerCallback);
  }, [app.ticker]);

  return (
    <Sprite
      image="https://pixijs.io/examples/examples/assets/bunny.png"
      x={100}
      y={200}
      anchor={0.5}
      rotation={rotation}
    />
  );
};

const BunnyWithApp = withPixiApp(BunnySprite);

const PixiComponent = () => {
  return (
    <Stage
      width={400}
      height={800}
      options={{ preserveDrawingBuffer: true, backgroundAlpha: 0 }}
    >
      <BunnyWithApp />
    </Stage>
  );
};

export default PixiComponent;

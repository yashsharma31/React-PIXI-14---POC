import React, { useEffect, useRef } from "react";
import { Stage, useApp } from "@pixi/react";
import * as PIXI from "pixi.js";

const VideoSprite = ({ videoSrc }: { videoSrc: string }) => {
  const spriteRef = useRef(null);
  const app = useApp();

  useEffect(() => {
    const videoElement = document.createElement("video");
    videoElement.src = videoSrc;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.autoplay = true; // Mute the video to allow autoplay
    // Create the video texture
    const videoTexture = PIXI.Texture.from(videoElement);
    const videoControl = videoTexture.baseTexture.resource.source;

    // Set video properties
    videoControl.loop = true;

    // When the video is loaded, play it
    videoTexture.baseTexture.on("loaded", () => {
      videoControl.play();
    });

    // Create a sprite to display the video
    const videoSprite = new PIXI.Sprite(videoTexture);

    // Adjust the sprite size as needed
    videoSprite.width = app.screen.width;
    videoSprite.height = app.screen.height;

    // Add the sprite to the PIXI application
    app.stage.addChild(videoSprite);

    // Keep a reference to the sprite for cleanup
    spriteRef.current = videoSprite;

    // Cleanup function to stop the video when the component unmounts
    return () => {
      videoControl.pause();
      app.stage.removeChild(videoSprite);
      videoSprite.destroy();
    };
  }, [app, videoSrc]);

  return null; // This component does not render anything itself
};

const VideoInPixi = () => {
  return (
    <Stage width={400} height={800} options={{ preserveDrawingBuffer: true }}>
      <VideoSprite videoSrc="/video1.mp4" />
    </Stage>
  );
};

export default VideoInPixi;

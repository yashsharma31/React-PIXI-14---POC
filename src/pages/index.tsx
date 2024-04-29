import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

const PixiComponentNoSSR = dynamic(
  () => import("../components/PixiComponent"),
  {
    ssr: false,
  }
);
const LottieComponent = dynamic(
  () => import("../components/LottiePixiComponent"),
  {
    ssr: false,
  }
);
const VideoInPixi = dynamic(() => import("../components/VideoSprite"), {
  ssr: false,
});

const Home = () => {
  const [isCapturingComplete, setIsCapturingComplete] = useState(false);
  const sessionUUID = "jcnqecneqnenenflqnfiqlnqnl"; // Unique session identifier for this capture session
  const animationContainerRef = useRef(null);
  const framesListRef = useRef(null);
  const router = useRouter();
  console.log(router.asPath.split("?").splice(1));
  const incommingData = router.asPath.split("?").splice(1);

  let iDuration = 0;
  let iFrameRate = 0;
  if (incommingData && incommingData.length > 0) {
    iDuration = Number(incommingData[0].split("=")[1]);
    iFrameRate = Number(incommingData[1].split("=")[1]);
  }
  console.log(iDuration, iFrameRate);
  const [frameRate, setFrameRate] = useState(iFrameRate || 30);
  const [duration, setDuration] = useState(iDuration || 1); // Duration in seconds

  useEffect(() => {
    // Ensure frames-list div exists
    let framesList = document.getElementById("frames-list");
    if (!framesList) {
      framesList = document.createElement("div");
      framesList.id = "frames-list";
      framesList.style.display = "none"; // Hidden by default
      document.body.appendChild(framesList);
    }
    framesListRef.current = framesList;
  }, []);

  const recordVideoFromPuppeteer = async () => {
    try {
      const res = await fetch("http://localhost:3005/record-video", {
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
        body: JSON.stringify({
          id: sessionUUID,
          videoDuration: duration,
          framePerSecond: frameRate,
        }),
      });
      console.log("### res", res);
    } catch (error) {
      console.log("### error", error);
    }
  };

  const captureFrames = async () => {
    const frameRate = 24; // Targeting 24 frames per second
    const duration = 3; // Duration in seconds
    const totalFrames = frameRate * duration;
    let capturedFrames = 0;
    let startTime = null;

    const captureFrame = async (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      if (elapsedTime > capturedFrames * (1000 / frameRate)) {
        console.log(elapsedTime, capturedFrames, totalFrames);
        if (animationContainerRef.current) {
          const htmlCanvas = await html2canvas(animationContainerRef.current);
          const dataUrl = htmlCanvas.toDataURL("image/png");
          const frameItem = document.createElement("li");
          frameItem.id = `image-${capturedFrames + 1}.png`;
          frameItem.innerHTML = `${dataUrl}`;
          framesListRef.current.appendChild(frameItem);

          capturedFrames++;

          if (capturedFrames >= totalFrames) {
            setIsCapturingComplete(true);
            // Append a div to signify capture completion
            const completionDiv = document.createElement("div");
            completionDiv.id = `id-${sessionUUID}`;
            completionDiv.innerText = "Video recorded";
            document.body.appendChild(completionDiv);
            return; // Stop the frame capturing
          }
        }
      }

      requestAnimationFrame(captureFrame);
    };

    requestAnimationFrame(captureFrame);
  };

  return (
    <>
      <Head>
        <title>Next.js with PixiJS and Lottie</title>
      </Head>
      <main className="container mx-auto p-4">
        <div>
          <label htmlFor="frameRate">Frame Rate:</label>
          <select
            id="frameRate"
            value={frameRate}
            onChange={(e) => setFrameRate(Number(e.target.value))}
          >
            <option value={24}>24 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
          </select>
        </div>
        <div>
          <label htmlFor="duration">Duration (Seconds):</label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={1}>1 Second</option>
            <option value={2}>2 Seconds</option>
            <option value={3}>3 Seconds</option>
            <option value={4}>4 Seconds</option>
            <option value={5}>5 Seconds</option>
          </select>
        </div>
        <button
          onClick={captureFrames}
          id="record-video-button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Capture Frames
        </button>
        <button
          onClick={() => recordVideoFromPuppeteer()}
          id="capture-video-button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Record
        </button>
        <div
          ref={animationContainerRef}
          className="bg-white w-[400px] h-[800px] flex relative border-2 border-red my-4"
        >
          <div className="absolute">
            <PixiComponentNoSSR />
          </div>
          <div className="absolute">
            <LottieComponent />
          </div>
          <VideoInPixi />
        </div>
        {/* Optionally display the #frames-list for debugging or visibility */}
        <div id="frames-list" ref={framesListRef} style={{ display: "none" }}>
          {/* Frames will be appended here dynamically */}
        </div>
      </main>
    </>
  );
};

export default Home;

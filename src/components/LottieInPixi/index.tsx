// import React, { useEffect, useRef } from "react";
// import { AppProvider, Sprite, useApp } from "@pixi/react";
// import lottie, { AnimationItem } from "lottie-web";
// import * as PIXI from "pixi.js";
// import animationData from "../../assets/lottie-animation.json";

// const LottieInPixi = () => {
//   const app = new PIXI.Application({
//     width: 800,
//     height: 600,
//     backgroundColor: 0x1099bb,
//   });
//   const spriteRef = useRef<PIXI.Sprite | null>(null);
//   const canvasRef = useRef(document.createElement("canvas"));
//   const animationRef = useRef<AnimationItem | undefined>();

//   useEffect(() => {
//     const context = canvasRef.current.getContext("2d");
//     const { w, h } = animationData;
//     canvasRef.current.width = w;
//     canvasRef.current.height = h;

//     animationRef.current = lottie.loadAnimation({
//       container: canvasRef.current,
//       renderer: "canvas",
//       loop: true,
//       autoplay: true,
//       animationData: animationData,
//     });

//     const texture = PIXI.Texture.from(canvasRef.current);
//     if (spriteRef.current) {
//       spriteRef.current.texture = texture;
//     }

//     const updateTexture = () => {
//       if (context && animationRef.current?.isLoaded) {
//         texture.update();
//       }
//       requestAnimationFrame(updateTexture);
//     };

//     updateTexture();

//     return () => {
//       animationRef.current?.destroy();
//     };
//   }, [animationData, app]);

//   return (
//     <AppProvider app={app}>
{
  /* <Stage width={800} height={600}>
  <Sprite ref={spriteRef} />
</Stage>; */
}
//     </AppProvider>
//   );
// };

// export default LottieInPixi;

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LandingWrapper = styled.div<{ $isFadeOut: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;

  opacity: ${(props) => (props.$isFadeOut ? 0 : 1)};
  transition: opacity 3s ease-in-out;
`;

const CarpetBottom = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarpetTop = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  transition: opacity 5s ease-in-out;
`;

const CursorImg = styled.img`
  position: fixed;
  pointerevents: none;
  zindex: 10000;
  width: 100px;
`;

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFadeOut, setIsFadeOut] = useState(false);

  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const carpetImg = new Image();
    const carpetReverseImg = new Image();
    const brushImg = new Image();

    carpetImg.src = "/carpet.webp";
    carpetReverseImg.src = "/carpet-reverse.webp";
    brushImg.src = "/icon/brush.png";

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const imgRatio = carpetReverseImg.width / carpetReverseImg.height;
      const canvasRatio = canvas.width / canvas.height;

      if (imgRatio > canvasRatio) {
        ctx.drawImage(
          carpetReverseImg,
          (canvas.width - canvas.height * imgRatio) / 2,
          0,
          canvas.height * imgRatio,
          canvas.height,
        );
      } else {
        ctx.drawImage(
          carpetReverseImg,
          0,
          (canvas.height - canvas.width / imgRatio) / 2,
          canvas.width,
          canvas.width / imgRatio,
        );
      }
      startTimer();
    };

    let isLoaded = 0;
    const checkAllLoaded = () => {
      isLoaded++;
      if (isLoaded === 3) initCanvas();
    };

    [carpetImg, carpetReverseImg, brushImg].forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.onload = checkAllLoaded;
        img.onerror = () => console.error(`${img.src} 로드 실패`);
      }
    });

    const startTimer = () => {
      setTimeout(() => {
        setIsFadeOut(true);
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        }, 4000);
      }, 5000);
    };

    const scratch = (x: number, y: number) => {
      if (!ctx || !brushImg.complete || !carpetReverseImg.complete) return;

      const brushSize = window.innerWidth * 0.15;
      const isNegative = x < prevPos.current.x || y < prevPos.current.y;

      if (isNegative) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        ctx.drawImage(
          brushImg,
          x - brushSize / 2,
          y - brushSize / 2,
          brushSize,
          brushSize,
        );

        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(carpetReverseImg, 0, 0, canvas.width, canvas.height);

        ctx.restore();
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(
          brushImg,
          x - brushSize / 2,
          y - brushSize / 2,
          brushSize,
          brushSize,
        );
      }

      prevPos.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => scratch(e.clientX, e.clientY);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <LandingWrapper ref={containerRef} $isFadeOut={isFadeOut}>
      <CarpetBottom src="/carpet.webp" />
      <CarpetTop ref={canvasRef} />
      <CursorImg id="logo-cursor" src="/icon/cursor.svg" />
    </LandingWrapper>
  );
};

export default Landing;

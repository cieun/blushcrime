import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LandingWrapper = styled.div<{ $isFadeOut: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  height: 100%;

  margin: 0;

  z-index: 999;
  pointer-events: ${(props) => (props.$isFadeOut ? "none" : "auto")};
  touch-action: ${(props) => (props.$isFadeOut ? "auto" : "none")};
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
`;

const CursorImg = styled.img`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10000;
  width: 100px;
  transform: translate(-200px, -200px);
  will-change: transform;
`;

const MobileLanding = () => {
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

    let isLoaded = 0;
    const handleLoad = () => {
      isLoaded++;
      if (isLoaded === 3) initCanvas();
    };

    [carpetImg, carpetReverseImg, brushImg].forEach(
      (img) => (img.onload = handleLoad),
    );

    const initCanvas = () => {
      if (!containerRef.current || !canvasRef.current) return;

      const { width, height } = containerRef.current.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      const drawCoverImage = (img: HTMLImageElement) => {
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
          // 이미지가 캔버스보다 더 가로로 긴 경우
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // 이미지가 캔버스보다 더 세로로 긴 경우
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      };

      drawCoverImage(carpetReverseImg);
      startTimer();
    };

    const startTimer = () => {
      setTimeout(() => {
        setIsFadeOut(true);
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        }, 6000);
      }, 7000);
    };

    const scratch = (x: number, y: number) => {
      if (!ctx || !brushImg.complete || !carpetReverseImg.complete) return;

      const brushSize = window.innerWidth * 0.2;
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

    const updateCursor = (x: number, y: number) => {
      const cursor = document.getElementById("logo-cursor");
      if (cursor) {
        cursor.style.transform = `translate(${x + 10}px, ${y + 10}px)`;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;

      scratch(clientX, clientY);
      updateCursor(clientX, clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      scratch(e.clientX, e.clientY);
      updateCursor(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
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

export default MobileLanding;

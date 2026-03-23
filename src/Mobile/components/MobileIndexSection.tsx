import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const IndexContainer = styled.div<{ $isIndexMode: boolean }>`
  flex: 4;

  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;

  justify-content: ${(props) => (props.$isIndexMode ? "flex-start" : "center")};
  align-items: ${(props) => (props.$isIndexMode ? "flex-start" : "center")};
`;

// 1. Floating 모드
const FloatingContainer = styled.div`
  position: relative;
  width: 50%;
  height: 50%;

  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
  }
`;

const FloatingItem = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  white-space: nowrap;
  padding: 2px 5px;
  z-index: 20;
  will-change: transform;

  &:hover > div {
    opacity: 1;
  }
`;

// 2. Index(List) 모드
const ListContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const ListItemContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const ListItem = styled.div`
  cursor: pointer;
  display: flex;
  gap: 10px;

  &:hover {
    color: ${({ theme }) => theme.colors.garnetRed};
  }
`;

const NumberDescription = styled.div`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 2rem;
  color: ${({ theme }) => theme.colors.neutralGrey};
  transition: opacity 0.2s ease;
  pointer-events: none;
`;

const DirectionMark = styled.span<{ $isIndexMode: boolean }>`
  position: ${(props) => (props.$isIndexMode ? "static" : "absolute")};
  top: 0;
  left: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3.5px;
  text-decoration-thickness: 0.5px;
  z-index: 30;
  white-space: nowrap;
  will-change: ${(props) => (props.$isIndexMode ? "auto" : "transform")};
`;

// 물리 엔진
class Rect {
  x: number;
  y: number;
  vx: number; //가속도x
  vy: number; //가속도y
  w: number;
  h: number;
  index: number;
  isTracking: boolean = false;
  constructor(x: number, y: number, w: number, h: number, index: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.index = index;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }

  applyForce(fx: number, fy: number) {
    this.vx += fx;
    this.vy += fy;
  }

  update(width: number, height: number) {
    if (this.isTracking) {
      const dx = width / 2 - this.x;
      const dy = height / 2 - this.y;
      const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

      if (distanceToCenter > 2) {
        this.vx += dx * 0.004; //선택 아이템 속도(비례함)
        this.vy += dy * 0.004;
        this.vx *= 0.9;
        this.vy *= 0.9;
      } else {
        this.isTracking = false;
        this.vx = 0;
        this.vy = 0;
      }
    }
    this.vx *= 0.9;
    this.vy *= 0.9;

    this.x += this.vx;
    this.y += this.vy;
    if (this.x < this.w / 2 || this.x > width - this.w / 2) this.vx *= -1;
    if (this.y < this.h / 2 || this.y > height - this.h / 2) this.vy *= -1;
  }
}

interface IndexProps {
  projects: any[];
  onSelect: (index: number) => void;
}

const MobileIndexSection = ({ projects, onSelect }: IndexProps) => {
  const floatingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isIndexMode, setIsIndexMode] = useState(false);
  const rectsRef = useRef<Rect[]>([]);

  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const directionMarkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isIndexMode) return;

    const canvas = canvasRef.current;
    const container = floatingRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    if (rectsRef.current.length === 0) {
      const totalItems = projects.length + 1;
      rectsRef.current = Array.from({ length: totalItems }).map(
        (_, i) =>
          new Rect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            60,
            20,
            i,
          ),
      );
    }

    // 부딪힌 아이템들
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rects = rectsRef.current;

      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const r1 = rects[i];
          const r2 = rects[j];

          const dx = r2.x - r1.x;
          const dy = r2.y - r1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const minDistance = 40;

          if (distance < minDistance) {
            const overlap = minDistance - distance;

            const nx = dx / distance;
            const ny = dy / distance;

            const impulse = overlap * 0.2;

            r1.applyForce(-nx * impulse, -ny * impulse);
            r2.applyForce(nx * impulse, ny * impulse);

            r1.x -= nx * (overlap / 2);
            r1.y -= ny * (overlap / 2);
            r2.x += nx * (overlap / 2);
            r2.y += ny * (overlap / 2);
          }
        }
      }

      // 캔버스 안에 아이템 배치
      rects.forEach((r, i) => {
        r.update(canvas.width, canvas.height);

        if (i < projects.length) {
          const el = itemRefs.current[i];
          if (el) {
            el.style.transform = `translate3d(${r.x - r.w / 2}px, ${r.y - r.h / 2}px, 0)`;
          }
        } else {
          const el = directionMarkRef.current;
          if (el) {
            el.style.transform = `translate3d(${r.x - r.w / 2}px, ${r.y - r.h / 2}px, 0)`;
          }
        }
      });
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [isIndexMode, projects]);

  return (
    <IndexContainer $isIndexMode={isIndexMode}>
      {/* 1. Floating 모드 */}
      {!isIndexMode ? (
        <FloatingContainer ref={floatingRef}>
          <canvas ref={canvasRef} />
          {projects.map((project, idx) => (
            <FloatingItem
              key={idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => {
                rectsRef.current.forEach((r) => (r.isTracking = false));
                rectsRef.current[idx].isTracking = true;

                onSelect(idx);
              }}
            >
              ({idx + 1})
              <NumberDescription>
                {project.title} ({project.description})
              </NumberDescription>
            </FloatingItem>
          ))}
          <DirectionMark
            ref={(el) => {
              (directionMarkRef as any).current = el;
            }}
            $isIndexMode={isIndexMode}
            onClick={() => setIsIndexMode(!isIndexMode)}
          >
            {"(Index)"}
          </DirectionMark>
        </FloatingContainer>
      ) : (
        /* 2. List 모드 */
        <ListContainer>
          <ListItemContainer>
            {projects.map((project, idx) => (
              <ListItem key={idx} onClick={() => onSelect(idx)}>
                <span>({idx + 1})</span>
                <span>
                  {project.title} ({project.description})
                </span>
              </ListItem>
            ))}
          </ListItemContainer>
          <DirectionMark
            $isIndexMode={isIndexMode}
            onClick={() => setIsIndexMode(!isIndexMode)}
          >
            {"(back)"}
          </DirectionMark>
        </ListContainer>
      )}
    </IndexContainer>
  );
};

export default MobileIndexSection;

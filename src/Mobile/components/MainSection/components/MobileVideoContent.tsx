import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Player from "@vimeo/player";

const PlayerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const MediaContainer = styled.div<{ $aspect: string }>`
  position: relative;
  width: 100%;
  background: #000;
  aspect-ratio: ${(props) => props.$aspect};
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const ControlsOverlay = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.garnetRed};
  margin: 1rem 0;
  width: 100%;
`;

const ControlBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-family: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

const ProgressArea = styled.div`
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 2px;
  background-color: rgba(201, 0, 43, 0.2);
  position: relative;
`;

const ProgressFill = styled.div<{ $width: number }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.garnetRed};
  width: ${({ $width }) => $width}%;
  transition: width 0.1s linear;
`;

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface PlayerProps {
  media: MediaItem;
}

const MobileVideoPlayer = ({ media }: PlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aspect, setAspect] = useState("16 / 9");

  const videoId = `vimeo-${media.src.split("/").pop()?.split("?")[0]}`;

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const timer = setTimeout(() => {
      const iframe = document.getElementById(videoId) as HTMLIFrameElement;
      if (iframe) {
        const newPlayer = new Player(iframe);
        playerRef.current = newPlayer;

        newPlayer.on("play", () => setIsPlaying(true));
        newPlayer.on("pause", () => setIsPlaying(false));
        newPlayer.on("timeupdate", (data) => setProgress(data.percent * 100));
        newPlayer.on("loaded", async () => {
          try {
            const width = await newPlayer.getVideoWidth();
            const height = await newPlayer.getVideoHeight();
            if (width && height) {
              setAspect(`${width} / ${height}`);
            }
          } catch (error) {
            console.error("비디오 정보를 가져오지 못했습니다.", error);
          }
        });
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      playerRef.current?.destroy();
    };
  }, [media.src, videoId]);

  const togglePlay = () => {
    if (isPlaying) playerRef.current?.pause();
    else playerRef.current?.play();
  };

  const handleFullscreen = () => {
    playerRef.current?.requestFullscreen();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    playerRef.current?.getDuration().then((duration) => {
      playerRef.current?.setCurrentTime(duration * ratio);
    });
  };

  return (
    <PlayerWrapper>
      <MediaContainer $aspect={aspect} ref={containerRef}>
        <iframe
          key={media.src}
          id={videoId}
          src={`${media.src}${media.src.includes("?") ? "&" : "?"}controls=0&transparent=true&autoplay=1&muted=1&loop=1`}
          allow="autoplay; fullscreen"
        />
      </MediaContainer>

      <ControlsOverlay>
        <ControlBtn onClick={togglePlay}>
          {isPlaying ? "(pause)" : "(play)"}
        </ControlBtn>

        <ProgressArea onClick={handleSeek}>
          <ProgressTrack>
            <ProgressFill $width={progress} />
          </ProgressTrack>
        </ProgressArea>

        <ControlBtn onClick={handleFullscreen}>(fs)</ControlBtn>
      </ControlsOverlay>
    </PlayerWrapper>
  );
};

export default MobileVideoPlayer;

import { useState, useEffect } from "react";
import styled from "styled-components";
import { RiCloseLargeLine } from "react-icons/ri";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const SliderContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-start;

  .image-content {
    width: 100%;
    cursor: zoom-in;
  }

  img {
    width: 100%;
    display: block;
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.seashell};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: zoom-out;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: none;
  border: none;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
`;

const NavButton = styled.button<{ $direction: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$direction === "left" ? "left: 10px;" : "right: 10px;")}
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.garnetRed};
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.2s;

  &:hover {
  }

  &:disabled {
    visibility: hidden;
  }
`;

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface MobileImageContentProps {
  mediaList: MediaItem[];
  projectTitle: string;
}

const MobileImageContent = ({
  mediaList,
  projectTitle,
}: MobileImageContentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [mediaList]);

  if (!mediaList || mediaList.length === 0) return null;

  const currentMedia = mediaList[currentIndex] || mediaList[0];

  if (!currentMedia) return null;

  const hasMultiple = mediaList.length > 1;
  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(mediaList.length - 1, prev + 1));

  return (
    <div style={{ width: "100%" }}>
      <SliderContainer>
        {hasMultiple && (
          <>
            <NavButton
              $direction="left"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <MdArrowBackIos />
            </NavButton>
            <NavButton
              $direction="right"
              onClick={handleNext}
              disabled={currentIndex === mediaList.length - 1}
            >
              <MdArrowForwardIos />
            </NavButton>
          </>
        )}

        <div className="image-content" onClick={() => setIsFullscreen(true)}>
          <img src={mediaList[currentIndex].src} alt={projectTitle} />
        </div>
      </SliderContainer>
      {isFullscreen && (
        <FullscreenOverlay onClick={() => setIsFullscreen(false)}>
          <CloseButton onClick={() => setIsFullscreen(false)}>
            <RiCloseLargeLine />
          </CloseButton>
          <FullImage src={mediaList[currentIndex].src} alt={projectTitle} />
        </FullscreenOverlay>
      )}
    </div>
  );
};

export default MobileImageContent;

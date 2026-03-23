import styled from "styled-components";
import MobileImageContent from "./MobileImageContent";
import MobileVideoContent from "./MobileVideoContent";

const ContentWrapper = styled.div`
  width: 100%;
`;

const TextContainer = styled.div`
  width: 100%;
`;

const ContentTitle = styled.h1``;

const ContentDescription = styled.p`
  margin-bottom: 1.5rem;
`;

const MediaSection = styled.div`
  width: 100%;
  //   display: flex;
  //   justify-content: flex-start;

  & > div {
    width: 100%;
    // height: auto;
    // max-height: 70vh;
    // aspect-ratio: auto;
    // max-width: fit-content;
  }
`;

interface ContentProps {
  project: any;
}

const Content = ({ project }: ContentProps) => {
  if (!project || !project.media || project.media.length === 0) return null;

  const isVideoProject = project.media[0].type === "video";

  return (
    <ContentWrapper>
      <TextContainer>
        <ContentTitle>{project.title}</ContentTitle>
        <ContentDescription>{project.description}</ContentDescription>
      </TextContainer>

      <MediaSection>
        {isVideoProject ? (
          <MobileVideoContent media={project.media[0]} />
        ) : (
          <MobileImageContent
            mediaList={project.media}
            projectTitle={project.title}
          />
        )}
      </MediaSection>
    </ContentWrapper>
  );
};

export default Content;

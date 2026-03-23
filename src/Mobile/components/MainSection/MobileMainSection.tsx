import styled from "styled-components";
import Header from "../../../components/MainSection/components/Header";
import MobileContent from "./components/MobileContent";
import MobileIndexSection from "../MobileIndexSection";
import About from "../../../components/MainSection/About";

const MainContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.padding};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 80px;
`;

const MobileIndexWrapper = styled.div`
  width: 100%;
  height: 60vh;
  position: relative;
`;

interface MainSectionProps {
  isAboutOpen: boolean;
  currentProject: any;
  onSelectProject: (index: number) => void;
  projectsData: any[];
}

const MobileMainSection = ({
  isAboutOpen,
  currentProject,
  onSelectProject,
  projectsData,
}: MainSectionProps) => {
  return (
    <MainContainer>
      <Header />
      {isAboutOpen ? (
        <About />
      ) : (
        <>
          <MobileIndexWrapper>
            <MobileIndexSection
              projects={projectsData}
              onSelect={onSelectProject}
            />
          </MobileIndexWrapper>
          <MobileContent project={currentProject} />
        </>
      )}
    </MainContainer>
  );
};

export default MobileMainSection;

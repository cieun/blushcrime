import styled from "styled-components";
import Header from "./components/Header";
import Content from "./components/Content";

const MainContainer = styled.div`
  flex: 2;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface MainSectionProps {
  isAboutOpen: boolean;
  currentProject: any;
  onSelectProject: (index: number) => void;
  projectsData: any[];
}

const MainSection = ({ currentProject }: MainSectionProps) => {
  return (
    <MainContainer>
      <Header />
      <Content project={currentProject} />
    </MainContainer>
  );
};

export default MainSection;

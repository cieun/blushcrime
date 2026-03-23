import styled from "styled-components";

const AboutContent = styled.div`
  display: block;
  width: 100%;
  flex: 4;
`;

const About = () => {
  return (
    <AboutContent>
      <h1>
        <u>blushcrime.studio</u> is a Seoul-based art studio founded by{" "}
        <u>Yoona Jeung.</u> Working with digital imagery across 3D, AI fashion,
        photography, and video, the studio explores the sensorial space between
        personal diaries and public billboards. By overlapping archived memories
        with unreal fictions within a single continuous flow, it generates new
        layers of perception through experimental media practice
      </h1>
    </AboutContent>
  );
};

export default About;

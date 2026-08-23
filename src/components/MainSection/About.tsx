import styled from "styled-components";

const AboutContent = styled.div`
  display: block;
  width: 100%;
  flex: 4;
`;

const CvContent = styled.div`
  display: block;
  width: 100%;
  margin-top: 3rem;

  & > h1 {
    margin-bottom: 1rem;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryName = styled.div`
  display: block;
`;

const CategoryContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const YearLabel = styled.div`
  display: block;
  flex: 1;
`;

const DetailLabel = styled.div`
  display: block;
  flex: 5;
`;

const CV_DATA = [
  {
    id: "education",
    category: "Education",
    items: [
      { id: 1, year: "2016", detail: "Seoul Arts High School, Korea" },
      {
        id: 2,
        year: "2020",
        detail:
          "BA Visual Communication design, Hongik University, Seoul, Korea",
      },
      {
        id: 3,
        year: "2024",
        detail: "Exchange Program, Design Academy Eindhoven, Netherlands",
      },
      {
        id: 4,
        year: "2025",
        detail:
          "BA (Hons) Fashion Communication: Image and Promotion program at Central Saint Martins.",
      },
    ],
  },
  {
    id: "brandWork",
    category: "Brand Work",
    items: [
      {
        id: 1,
        year: "2023",
        detail: "Gentlemonster, 3D Digital Content designer",
      },
      {
        id: 2,
        year: "2023",
        detail: "Maison Margiela X Gentlemonster collaboration Content design",
      },
      {
        id: 3,
        year: "2023",
        detail: "D’heygere X Gentlemonster collaboration content design",
      },
      {
        id: 4,
        year: "2024",
        detail: "Jennie X Gentlemonster collaboration content design",
      },
      { id: 5, year: "2026", detail: "Spinelli Kilcollin content design" },
      {
        id: 6,
        year: "2026",
        detail: "SIMIHAZE x Spinelli Kilcollin event content design ",
      },
    ],
  },
  {
    id: "exhibition",
    category: "Exhibition",
    items: [
      {
        id: 1,
        year: "2022",
        detail: "«Kick & Kreate», 777 gallery, Seoul, Korea",
      },
      {
        id: 2,
        year: "2022",
        detail: "«Yueminjun exhibition», ACC, Gwangju, Korea",
      },
      {
        id: 3,
        year: "2025",
        detail: "«The Downtown», HIVCD Graduation, Seoul, Korea",
      },
      {
        id: 4,
        year: "2026",
        detail: "«Dirty Precision», onsu gonggan, seoul, Korea ",
      },
    ],
  },
  {
    id: "eventManagement",
    category: "Event management",
    items: [
      {
        id: 1,
        year: "2025",
        detail: "«Quickation»,Shoreditch, London, Creative direction",
      },
      {
        id: 2,
        year: "2025",
        detail: "«Reality PSD POP-UP», PDF SEOUL,  Project Manager",
      },
    ],
  },
];

const About = () => {
  return (
    <AboutContent>
      <h1>
        <u>yoonana.studio</u> is a Seoul-based art studio founded by{" "}
        <u>Yoona Jeung.</u> Working with digital imagery across 3D, AI fashion,
        photography, and video, the studio explores the sensorial space between
        personal diaries and public billboards. By overlapping archived memories
        with unreal fictions within a single continuous flow, it generates new
        layers of perception through experimental media practice.
      </h1>
      <CvContent>
        <h1>CV</h1>
        {CV_DATA.map((section) => (
          <CategorySection key={section.id}>
            <CategoryName>{section.category}</CategoryName>
            {section.items.map((item) => (
              <CategoryContent key={item.id}>
                <YearLabel>{item.year}</YearLabel>
                <DetailLabel>{item.detail}</DetailLabel>
              </CategoryContent>
            ))}
          </CategorySection>
        ))}
      </CvContent>
    </AboutContent>
  );
};

export default About;

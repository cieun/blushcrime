import { useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "./lib/supabase";

import Landing from "./components/Landing";
import MainSection from "./components/MainSection/MainSection";
import IndexSection from "./components/IndexSection";
import Menu from "./components/Menu";
import About from "./components/MainSection/About";

const MainPage = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
`;

interface Project {
  id: number;
  title: string;
  description: string;
  year: string;
  category: string;
  media: any[];
  thumbnail: string;
}

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setProjects(data);
      } catch (error) {
        console.error("데이터 로드 에러:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById("logo-cursor");
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const currentProject = projects[currentIndex];
  if (loading) return null;
  if (projects.length === 0) return <div>No projects found.</div>;

  return (
    <MainPage>
      <Landing />
      <MainSection
        isAboutOpen={isAboutOpen}
        currentProject={currentProject}
        onSelectProject={(idx) => setCurrentIndex(idx)}
        projectsData={projects}
      />
      {!isAboutOpen ? (
        <IndexSection
          projects={projects}
          onSelect={(idx) => setCurrentIndex(idx)}
        />
      ) : (
        <About />
      )}
      <Menu
        isAboutOpen={isAboutOpen}
        onToggleAbout={() => setIsAboutOpen(!isAboutOpen)}
      />
    </MainPage>
  );
};

export default App;

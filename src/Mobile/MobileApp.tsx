import { useState, useEffect } from "react";
import styled from "styled-components";

import { supabase } from "../lib/supabase";

import MobileLanding from "./components/MobileLanding";
import MobileMainSection from "./components/MainSection/MobileMainSection";
import Menu from "../components/Menu";

const MainPage = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: -webkit-fill-available;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;

  position: relative;

  overflow-x: hidden;
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

const MobileApp = () => {
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
      <MobileLanding />
      <MobileMainSection
        isAboutOpen={isAboutOpen}
        currentProject={currentProject}
        onSelectProject={(idx) => setCurrentIndex(idx)}
        projectsData={projects}
      />
      <Menu
        isAboutOpen={isAboutOpen}
        onToggleAbout={() => setIsAboutOpen(!isAboutOpen)}
      />
    </MainPage>
  );
};

export default MobileApp;

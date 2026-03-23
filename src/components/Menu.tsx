import styled from "styled-components";

const MenuContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.padding};
  right: ${({ theme }) => theme.padding};
  display: flex;
  gap: 2rem;
  z-index: 100;
`;

const MenuItems = styled.span`
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 3.5px;
  text-decoration-thickness: 0.5px;
`;

interface MenuProps {
  isAboutOpen: boolean;
  onToggleAbout: () => void;
}

const Menu = ({ isAboutOpen, onToggleAbout }: MenuProps) => {
  return (
    <MenuContainer>
      <MenuItems>
        <a
          href="https://instagram.com/b.l.u.s.h.c.r.i.m.e/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </MenuItems>
      <MenuItems onClick={onToggleAbout}>
        {isAboutOpen ? "←" : "About"}
      </MenuItems>
    </MenuContainer>
  );
};

export default Menu;

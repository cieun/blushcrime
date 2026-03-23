import styled from "styled-components";

const StyledHeader = styled.header`
  width: 100%;
  z-index: 10;

  h1 {
    line-height: 1.5;

    a {
      text-decoration: underline;
      text-underline-offset: 3.5px;
      text-decoration-thickness: 0.5px;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Header = () => {
  return (
    <StyledHeader>
      <h1>
        Yoona is a multidisciplinary designer based in Seoul. <br />
        Contact me via{" "}
        <a href="mailto:blushcrime@gmail.com">@b.l.u.s.h.c.r.i.m.e</a>
      </h1>
    </StyledHeader>
  );
};

export default Header;

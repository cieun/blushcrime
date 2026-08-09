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
        <a href="mailto:yoonaj1219@gmail.com">yoonaj1219@gmail.com</a>
      </h1>
    </StyledHeader>
  );
};

export default Header;

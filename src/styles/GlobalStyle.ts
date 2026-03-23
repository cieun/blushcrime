import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html{
        font-size: 14px;
        font-family: 'CMU Serif', 'Garamond', 'Times New Roman', 'Georgia', serif;
        line-height: 1.5;
        font-weight: normal;
        word-break: keep-all;

        @media (max-width: 768px) {
            font-size: 12px;
        }
    }


    body {
        width: 100vw;
        height: 100vh;
        padding: ${({ theme }) => theme.padding};

        background-color: ${({ theme }) => theme.colors.seashell};
        color: ${({ theme }) => theme.colors.garnetRed};


        @media (max-width: 768px) {
                padding: 0;
        }
    }

    #root {
        width: 100%;
        height: 100%;
    }

    a {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }

    h1 {
        font-size: 1rem;
        margin: 0;
        font-weight: normal;
    }

    p {
        font-size: 0.75rem;
        font-weight: normal;
    }

    ul, li {
        list-style: none;
    }

    u{
    text-underline-offset : 3.5px;
      text-decoration-thickness: 0.5px;
    }
`;

export default GlobalStyle;

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      seashell: string;
      garnetRed: string;
      neutralGrey: string;
    };
    mobile: string;
    tablet: string;
    padding: string;
    mobilePadding: string;
  }
}

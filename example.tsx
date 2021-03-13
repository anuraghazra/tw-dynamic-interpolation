// @ts-ignore
import React from "react";

type Variants = "blue" | "orange" | "red";

export const theme = {
  variants: (variant: Variants) => {
    return {
      base: `text-${variant}-600 bg-${variant}-100 text-sm mr-2`,
    };
  },
};

type AppProps = {
  color: "red" | "blue" | "green";
  shade: 100 | 200 | 300;
  textSize: "sm" | "base" | "xl" | "xxl";
};

export const App = ({ color, shade, textSize }: AppProps) => {
  return <div classname={`text-${textSize} bg-${color}-${shade}`}></div>;
};

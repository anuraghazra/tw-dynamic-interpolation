import { FC } from "./example";

type AppProps = {
  color: "red" | "blue" | "green";
  shade: 100 | 200 | 300;
  textSize: "sm" | "base" | "xl" | "xxl";
};

export const App = ({ color, shade, textSize }: AppProps) => {
  return <div classname={`text-${textSize} bg-${color}-${shade}`}></div>;
};

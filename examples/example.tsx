type Variants = "blue" | "orange" | "red";

export const theme = {
  variants: (variant: Variants) => {
    return {
      base: `text-${variant}-600 bg-${variant}-100 text-sm mr-2`,
    };
  },
};

export type FC<T> = (props: T) => any;

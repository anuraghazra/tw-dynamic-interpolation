## Experimental

Extract PurgeCSS whitelists for dynamically interpolated tailwind classes.

## How it works?

#### Step 1.

First we find all the interpolated `TemplateLiteralExpression` in the code, and tranform them to wrap within a `as const` assertion.

```ts
type Color = "red" | "blue";
const t = `bg-{Color}-100`;
// -> const t = `bg-{Color}-100` as const;
```

#### Step 2.

And then we find and extract raw type information with the help of `ts.TypeChecker` and do some manipulation on the strings to get the final classes.

### Development

Install deps

```
yarn
```

Run script

```
yarn dev
```

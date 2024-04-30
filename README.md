# Create Test File README

Create Test File is an extension that allows for you to create a test file for a javascript/typescript-module using either jest or vitest. By right-clicking on the module and selecting Create Test File this extension will analyze your file and create the appropriate, corresponding test file for your module. 

# What?

Let's say that you have this file in your project:

```typescript
// fat-arrow-declaration.ts
export const fatArrowDeclaration = () => {
  return someNonExportedFunction();
};

const someNonExportedFunction = () => {
  return 666;
};
```

If you right-click on the file that contains this module and select Create Test File, the following file will be generated:

```typescript
// fat-arrow-declaration.test.ts
import { fatArrowDeclaration } from "./fat-arrow-declaration";
import { describe, expect, it } from "vitest";

describe("fatArrowDeclaration", () => {
  it("should work", () => {
    expect(fatArrowDeclaration()).not.toBeNull();
  });
});
```

Now, were you to use JavaScript instead of TypeScript, the appropriate extension will be used. And if you use jest instead of vitest, that will be imported. 

# Development

If you want to fork this, or contribute, just clone the repository and:

Install the dependencies
```bash
npm init
```

Then either run the dev watch:
```
npm run watch
```

Or just make your changes and, if you're running VS Code while developing this, _WHICH I REALLY SUGGEST YOU DO_, then press F5 to build and run it in a new instance of VS Code.

There are test files available in the ./test-suite-folder in this repo, you can use these to test various use-cases. And if you're missing a case, then new additions are always welcome!

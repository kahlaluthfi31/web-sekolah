import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // React Compiler plugin terlalu ketat untuk pattern fetch di useEffect
      // Pattern setLoading/setState dalam useEffect adalah valid dan umum dipakai
      "react-compiler/react-compiler": "off",
      "react-hooks/set-state-in-effect": "off",
      // next/image warning untuk <img> — tetap warn tapi jangan block
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;

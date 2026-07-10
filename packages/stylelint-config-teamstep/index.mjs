/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Any color/spacing/radius declaration must reference a token (var(--...)), never
    // a literal value. Font-family isn't included yet — only role tokens exist and
    // shorthand `font` declarations can't cleanly be forced through strict-value.
    "scale-unlimited/declaration-strict-value": [
      [
        "/color$/",
        "fill",
        "stroke",
        "border-radius",
        "/^margin/",
        "/^padding/",
        "gap",
        "row-gap",
        "column-gap",
        "box-shadow",
        "background-image",
      ],
      {
        ignoreValues: [
          "inherit",
          "transparent",
          "currentcolor",
          "unset",
          "initial",
          "0",
          "none",
          "auto",
          "50%",
        ],
        disableFix: true,
      },
    ],
  },
};

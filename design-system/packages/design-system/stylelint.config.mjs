export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Any color/spacing/radius declaration must reference a token (var(--...)), never
    // a literal value. Backed by tokens/primitive.json + tokens/semantic.json (color,
    // spacing, radius tiers). Font-family isn't included yet — only 3 role tokens exist
    // and shorthand `font` declarations can't cleanly be forced through strict-value.
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
      ],
      {
        ignoreValues: [
          "inherit",
          "transparent",
          "currentColor",
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

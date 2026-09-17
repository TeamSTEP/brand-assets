/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Token vars only for color/spacing/radius (font-family not gated yet).
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

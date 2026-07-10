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
    // stylelint-config-standard's default selector-class-pattern only allows plain
    // kebab-case, which rejects the BEM __element/--modifier separators every component
    // uses (e.g. .ds-badge--main-quest, .ds-badge__dot). Every class is still required to
    // carry the "ds-" design-system prefix.
    "selector-class-pattern": "^ds-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
  },
};

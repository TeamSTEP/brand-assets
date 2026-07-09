export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // Any color-related declaration must reference a token (var(--...)), never a
    // literal hex/rgb/hsl/named color. Extend this list (spacing, radius, etc.) once
    // the corresponding token tiers exist in tokens/*.json — an unbacked strict-value
    // rule is unenforceable, not stricter.
    "scale-unlimited/declaration-strict-value": [
      ["/color$/", "fill", "stroke"],
      {
        ignoreValues: ["inherit", "transparent", "currentColor", "unset", "initial"],
        disableFix: true,
      },
    ],
  },
};

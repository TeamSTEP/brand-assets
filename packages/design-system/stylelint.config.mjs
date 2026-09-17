import teamstepConfig from "@teamstep/stylelint-config";

export default {
  extends: [teamstepConfig],
  rules: {
    // BEM with ds- prefix (e.g. .ds-badge--main-quest, .ds-badge__dot).
    "selector-class-pattern":
      "^ds-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
  },
  overrides: [
    {
      files: ["src/effects/**/*.css"],
      rules: {
        "scale-unlimited/declaration-strict-value": null,
      },
    },
  ],
};

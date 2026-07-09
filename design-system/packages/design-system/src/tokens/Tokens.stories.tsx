import type { Meta, StoryObj } from "@storybook/react-vite";
import * as tokens from "./tokens.js";

// Renders every export in the generated tokens.ts as a swatch, so token drift (a value
// changing, a token disappearing) is visible here without editing this file. Assumes every
// current token is a color, which is true today (tokens/*.json only defines $type: "color").
// Revisit this once a non-color token tier (spacing, radius) is added — those need a
// different preview than a color swatch.
function TokenSwatches() {
  const entries = Object.entries(tokens) as Array<[string, string]>;

  return (
    <table style={{ borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 8 }}>Token</th>
          <th style={{ textAlign: "left", padding: 8 }}>Value</th>
          <th style={{ textAlign: "left", padding: 8 }}>Swatch</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([name, value]) => (
          <tr key={name}>
            <td style={{ padding: 8 }}>{name}</td>
            <td style={{ padding: 8 }}>{value}</td>
            <td style={{ padding: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: 24,
                  border: "1px solid #ccc",
                  background: value,
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta = {
  title: "Tokens",
  component: TokenSwatches,
} satisfies Meta<typeof TokenSwatches>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTokens: Story = {};

import type { Meta, StoryObj } from "@storybook/react-vite";
import * as tokens from "./tokens.js";

// Renders every export in the generated tokens.ts as a category-appropriate preview, so
// token drift (a value changing, a token disappearing) is visible here without editing
// this file. Category is inferred from the export name prefix (Color/Spacing/Radius/Font),
// which mirrors the top-level grouping in tokens/*.json.
type Category = "color" | "spacing" | "radius" | "font" | "other";

function categoryOf(name: string): Category {
  if (name.startsWith("Color")) return "color";
  if (name.startsWith("Spacing")) return "spacing";
  if (name.startsWith("Radius")) return "radius";
  if (name.startsWith("Font")) return "font";
  return "other";
}

function Preview({ category, value }: { category: Category; value: string }) {
  if (category === "color") {
    return (
      <span
        style={{
          display: "inline-block",
          width: 24,
          height: 24,
          border: "1px solid #ccc",
          background: value,
        }}
      />
    );
  }
  if (category === "spacing") {
    return <span style={{ display: "inline-block", height: 12, width: value, background: "#8591c9" }} />;
  }
  if (category === "radius") {
    return (
      <span
        style={{
          display: "inline-block",
          width: 32,
          height: 24,
          border: "1px solid #8591c9",
          borderRadius: value,
        }}
      />
    );
  }
  if (category === "font") {
    return <span style={{ fontFamily: value, fontSize: 16 }}>Team STEP</span>;
  }
  return null;
}

function TokenSwatches() {
  const entries = Object.entries(tokens) as Array<[string, string]>;

  return (
    <main>
      <h1 style={{ fontFamily: "monospace", fontSize: 14 }}>Design Tokens</h1>
      <table style={{ borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Token</th>
            <th style={{ textAlign: "left", padding: 8 }}>Value</th>
            <th style={{ textAlign: "left", padding: 8 }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, value]) => (
            <tr key={name}>
              <td style={{ padding: 8 }}>{name}</td>
              <td style={{ padding: 8 }}>{value}</td>
              <td style={{ padding: 8 }}>
                <Preview category={categoryOf(name)} value={value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const meta = {
  title: "Tokens",
  component: TokenSwatches,
} satisfies Meta<typeof TokenSwatches>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllTokens: Story = {};

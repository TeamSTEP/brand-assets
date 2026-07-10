/**
 * Ban className/style on exported prop interfaces — enforces CLAUDE.md closed API rule.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const noStylePassthroughRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow className and style on exported component prop interfaces.",
    },
    schema: [],
    messages: {
      noStylePassthrough:
        'Exported prop interface must not include "{{name}}" — closed APIs do not allow className/style passthrough.',
    },
  },
  create(context) {
    function isExportedInterface(node) {
      return node.parent?.type === "ExportNamedDeclaration";
    }

    function checkPropertySignatures(members) {
      for (const member of members) {
        if (member.type !== "TSPropertySignature") {
          continue;
        }
        if (member.key.type !== "Identifier") {
          continue;
        }
        const { name } = member.key;
        if (name === "className" || name === "style") {
          context.report({
            node: member.key,
            messageId: "noStylePassthrough",
            data: { name },
          });
        }
      }
    }

    return {
      TSInterfaceDeclaration(node) {
        if (!isExportedInterface(node)) {
          return;
        }
        checkPropertySignatures(node.body.body);
      },
      TSTypeAliasDeclaration(node) {
        if (!isExportedInterface(node)) {
          return;
        }
        const { typeAnnotation } = node;
        if (
          typeAnnotation.type === "TSTypeLiteral" ||
          typeAnnotation.type === "TSInterfaceBody"
        ) {
          checkPropertySignatures(typeAnnotation.members);
        }
      },
    };
  },
};

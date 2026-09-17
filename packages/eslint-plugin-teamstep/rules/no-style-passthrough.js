/**
 * Ban className/style on exported prop types (including via extends/intersection).
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const noStylePassthroughRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow className and style on exported component prop interfaces, including when reachable only via extends/intersection.",
    },
    schema: [],
    messages: {
      noStylePassthrough:
        'Exported prop type must not include "{{name}}" — closed APIs do not allow className/style passthrough.',
      unresolvedBase:
        'Cannot statically verify "{{name}}" is free of className/style — it is not declared in this file, so this rule can\'t see through it. Inline the shape locally or compose only from types declared in this file.',
    },
  },
  create(context) {
    /** @type {Map<string, import('estree').Node>} */
    const localTypes = new Map();
    const alreadyReported = new Set();

    function collectDeclarations(programBody) {
      for (const stmt of programBody) {
        const decl =
          stmt.type === "ExportNamedDeclaration" && stmt.declaration
            ? stmt.declaration
            : stmt;
        if (decl.type === "TSInterfaceDeclaration" || decl.type === "TSTypeAliasDeclaration") {
          localTypes.set(decl.id.name, decl);
        }
      }
    }

    function isExported(node) {
      return node.parent?.type === "ExportNamedDeclaration";
    }

    function reportForbiddenMember(member) {
      if (member.type !== "TSPropertySignature") return;
      if (member.key.type !== "Identifier") return;
      const { name } = member.key;
      if (name !== "className" && name !== "style") return;
      if (alreadyReported.has(member)) return;
      alreadyReported.add(member);
      context.report({ node: member.key, messageId: "noStylePassthrough", data: { name } });
    }

    function reportUnresolved(name, node) {
      if (alreadyReported.has(node)) return;
      alreadyReported.add(node);
      context.report({ node, messageId: "unresolvedBase", data: { name } });
    }

    // Only extends / intersection merge shapes; aliases, unions, and generics are skipped.
    function checkComposedTypeNode(typeNode, seen) {
      switch (typeNode.type) {
        case "TSTypeLiteral":
          for (const member of typeNode.members) reportForbiddenMember(member);
          return;
        case "TSInterfaceBody":
          for (const member of typeNode.body) reportForbiddenMember(member);
          return;
        case "TSIntersectionType":
          for (const member of typeNode.types) checkComposedTypeNode(member, seen);
          return;
        case "TSParenthesizedType":
          checkComposedTypeNode(typeNode.typeAnnotation, seen);
          return;
        case "TSTypeReference": {
          // Bare refs only — generics (Extract/Pick/…) are treated as narrowers, not merges.
          const hasTypeArgs = Boolean(typeNode.typeArguments ?? typeNode.typeParameters);
          const refName =
            !hasTypeArgs && typeNode.typeName.type === "Identifier"
              ? typeNode.typeName.name
              : null;
          if (refName) resolveReference(refName, typeNode, seen);
          return;
        }
        default:
          return;
      }
    }

    function resolveReference(name, reportNode, seen) {
      if (seen.has(name)) return;
      seen.add(name);
      const decl = localTypes.get(name);
      if (!decl) {
        reportUnresolved(name, reportNode);
        return;
      }
      checkDeclaration(decl, seen);
    }

    function checkDeclaration(decl, seen) {
      if (decl.type === "TSInterfaceDeclaration") {
        for (const member of decl.body.body) reportForbiddenMember(member);
        for (const heritage of decl.extends ?? []) {
          const expr = heritage.expression;
          const name = expr.type === "Identifier" ? expr.name : null;
          if (name) resolveReference(name, heritage, seen);
        }
      } else if (decl.type === "TSTypeAliasDeclaration") {
        const { typeAnnotation } = decl;
        if (
          typeAnnotation.type === "TSTypeLiteral" ||
          typeAnnotation.type === "TSInterfaceBody" ||
          typeAnnotation.type === "TSIntersectionType"
        ) {
          checkComposedTypeNode(typeAnnotation, seen);
        }
      }
    }

    return {
      Program(node) {
        collectDeclarations(node.body);
      },
      TSInterfaceDeclaration(node) {
        if (!isExported(node)) return;
        checkDeclaration(node, new Set([node.id.name]));
      },
      TSTypeAliasDeclaration(node) {
        if (!isExported(node)) return;
        checkDeclaration(node, new Set([node.id.name]));
      },
    };
  },
};

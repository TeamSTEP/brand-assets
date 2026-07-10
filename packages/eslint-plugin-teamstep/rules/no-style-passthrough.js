/**
 * Ban className/style on exported prop interfaces — enforces CLAUDE.md closed API rule.
 *
 * Follows `extends` heritage clauses and intersection/union types so a prop shape that
 * reaches className/style only indirectly (`interface FooProps extends WithClassName {}`,
 * `type FooProps = WithClassName & { id: string }`) is still caught, not just a className
 * declared directly on the exported type's own body. A type reference this rule can't
 * resolve locally (e.g. imported from another module) is reported as `unresolvedBase`
 * rather than silently passed — an unverifiable base is a gap, not a pass.
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

    // Only `extends` (interface heritage) and `&` (intersection) actually *merge in* another
    // shape's members — that's the composition pattern this rule exists to see through. A
    // plain alias (`type Foo = Bar`), a union (`type Foo = Bar | "literal"`), or a generic
    // utility-type instantiation (`Extract<Bar, "x">`, `Pick<Bar, "x">`) doesn't merge an
    // unknown shape into the exported prop type, so those are intentionally not resolved —
    // resolving them produced false positives on both patterns (e.g. `Extract<BadgeVariant,
    // ...>` and a plain re-exported union type) when tried against this codebase.
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
          // A bare reference with no type arguments — `Foo`, not `Foo<Bar>` — is the only
          // TSTypeReference shape treated as shape composition; a generic instantiation is
          // assumed to be a utility type (Extract/Pick/Omit/...) that narrows rather than
          // merges, and isn't followed.
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
        // Plain aliases, unions, and generic instantiations are intentionally not
        // recursed into — see the comment on checkComposedTypeNode.
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

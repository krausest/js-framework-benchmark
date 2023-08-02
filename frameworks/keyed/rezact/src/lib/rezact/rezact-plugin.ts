import { PluginOption } from "vite";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import * as walk from "acorn-walk";
import MagicString from "magic-string";

const acorn = Parser.extend(jsx());

let src = "";
let magicString: any = null;
let lastImport: any = null;
let importsUsed: any = {};
let signalsUsed: any = {};
let mapStateUsed: any = {};
let functionsToRun: any = [];

function wrapInUseSignal(node) {
  signalsUsed.useSignal = true;
  magicString.appendLeft(node.start, `useSignal(`);
  magicString.appendRight(node.end, `)`);
}

function wrapInUseMapState(node) {
  mapStateUsed.useMapState = true;
  magicString.appendLeft(node.start, `useMapState(`);
  magicString.appendRight(node.end, `)`);
}

function findDependencies(node, excludeDeps = {}) {
  const assignments: any = { ...excludeDeps };
  const identifiers: any = {};
  walk.simple(node, {
    AssignmentExpression(node: any) {
      if (node.left.name[0] !== "$") return;
      assignments[node.left.name] = true;
    },

    UpdateExpression(node: any) {
      if (node.argument.name[0] !== "$") return;
      assignments[node.argument.name] = true;
    },

    Identifier(node: any) {
      if (node.name[0] !== "$") return;
      identifiers[node.name] = true;
    },
  });
  const ids = Object.keys(identifiers);
  const assigns = Object.keys(assignments);
  return ids.filter((id) => !assigns.includes(id));
}

function wrapInCreateComputed(node, explicitDeps = null, excludeDeps = {}) {
  const deps = explicitDeps || findDependencies(node, excludeDeps);
  if (deps.length === 0) return;
  signalsUsed.createComputed = true;
  magicString.appendLeft(
    node.start,
    `createComputed(([${deps.join(",")}]) => `
  );
  magicString.appendRight(node.end, `, [${deps.join(",")}])`);
}

function tackOnDotVee(node) {
  magicString.appendRight(node.end, `.v`);
}

const arrProps = ["push", "pop", "splice", "shift", "unshift"];

function compileRezact(ast) {
  walk.ancestor(ast, {
    VariableDeclarator(node: any, _state) {
      const name = node.id.name;
      if (!name) return;
      if (name[0] === "$") {
        if (node.init.type === "Literal") wrapInUseSignal(node.init);
        if (node.init.type === "UnaryExpression") wrapInUseSignal(node.init);
        if (node.init.type === "ArrayExpression") wrapInUseMapState(node.init);
        if (node.init.type === "CallExpression")
          wrapInCreateComputed(node.init);
      }
    },

    TemplateLiteral(node: any) {
      wrapInCreateComputed(node);
    },

    UnaryExpression(node: any) {
      if (!node?.argument?.name) return;
      if (node.argument.name[0] === "$") tackOnDotVee(node.argument);
    },

    LogicalExpression(node: any, _state, ancestors: any) {
      if (node.left.type === "Identifier" && node.left.name[0] === "$")
        tackOnDotVee(node.left);

      const lastAncestor = ancestors.at(-1);
      const logicalExprAncestor = ancestors.find(
        (anc) =>
          anc.type === "LogicalExpression" ||
          anc.type === "ConditionalExpression"
      );

      if (
        logicalExprAncestor !== undefined &&
        logicalExprAncestor !== lastAncestor
      )
        return;

      const explicitDeps = findDependencies(node.left);
      wrapInCreateComputed(node, explicitDeps);
    },

    MemberExpression(node: any, _state, ancestors: any) {
      if (!node.property || !node.property.type || !node.property.name) return;
      if (
        node.property.type === "Identifier" &&
        node.property.name[0] === "$"
      ) {
        if (ancestors.at(-2).callee?.name === "xCreateElement") return;
        tackOnDotVee(node.property);
      }
    },

    CallExpression(node: any) {
      if (node.arguments) {
        node.arguments.forEach((arg) => {
          if (
            arg.type === "Identifier" &&
            arg.name[0] === "$" &&
            node.callee?.object?.name === "console" &&
            node.callee?.property?.name === "log"
          ) {
            tackOnDotVee(arg);
          } else if (
            node.callee.type === "MemberExpression" &&
            arrProps.includes(node.callee.property.name) &&
            arg.type === "Identifier" &&
            arg.name[0] === "$"
          ) {
            tackOnDotVee(arg);
          }
        });
      }
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name[0] === "$" &&
        node.callee.property.name === "map"
      ) {
        magicString.overwrite(
          node.callee.property.start,
          node.callee.property.end,
          "Map"
        );

        wrapInCreateComputed(node, [node.callee.object.name]);
      }
    },

    Identifier(_node: any, _state) {
      if (_node.name === "onMount") {
        importsUsed.useCustomElementsForMountCallbacks = true;
        functionsToRun.push("useCustomElementsForMountCallbacks()");
      }
      if (_node.name === "onUnmount") {
        importsUsed.useCustomElementsForMountCallbacks = true;
        functionsToRun.push("useCustomElementsForMountCallbacks()");
      }
    },

    Property(node: any, _state) {
      if (node.key.name && node.key.name[0] === "$") {
        wrapInUseSignal(node.value);
      }
      if (node.key.name === "value" && !importsUsed.useInputs)
        importsUsed.useInputs = true && functionsToRun.push("useInputs()");
    },

    ConditionalExpression(node: any) {
      wrapInCreateComputed(node);
      if (!node?.test?.name) return;
      if (node.test.name[0] === "$") {
        tackOnDotVee(node.test);
      }
    },

    ImportDeclaration(node: any) {
      lastImport = node;
    },

    BinaryExpression(node: any) {
      const name = node.left.name;
      if (name && name[0] === "$") tackOnDotVee(node.left);
    },

    UpdateExpression(node: any, _state) {
      const name = node.argument.name;
      if (!name) return;
      if (name[0] === "$") tackOnDotVee(node.argument);
    },

    AssignmentExpression(node: any, _state) {
      const name = node.left.name;
      if (!name) return;
      if (name[0] === "$") tackOnDotVee(node.left);
    },

    LabeledStatement(node: any) {
      if (node.label.name === "$") {
        if (node.body.type === "BlockStatement")
          wrapInCreateComputed(node.body);
        if (node.body.type === "ExpressionStatement")
          wrapInCreateComputed(node.body.expression);
      }
    },
  });
}

function rezact(): PluginOption {
  return {
    name: "transform-rezact",
    // enforce: "pre",
    transform(_src, id) {
      const supportedFileTypes = [".tsx", ".jsx", ".ts", ".js"];
      if (supportedFileTypes.find((sf) => id.includes(sf)) === undefined)
        return;
      if (id.includes("node_modules")) return;
      if (id.includes("rezact.ts")) return;
      if (id.includes("signals.ts")) return;
      if (id.includes("mapState.ts")) return;
      src = _src;
      magicString = null;
      lastImport = null;
      importsUsed = {};
      functionsToRun = [];
      // console.log(id);
      magicString = new MagicString(src);
      const ast = acorn.parse(src, {
        locations: true,
        ecmaVersion: "latest",
        sourceType: "module",
      });
      compileRezact(ast);
      const importsUsedArr = Object.keys(importsUsed);
      if (importsUsedArr.length > 0)
        magicString.prepend(
          `import {${importsUsedArr.join(",")}} from "src/lib/rezact/rezact"\n`
        );

      const signalsUsedArr = Object.keys(signalsUsed);
      if (signalsUsedArr.length > 0)
        magicString.prepend(
          `import {${signalsUsedArr.join(",")}} from "src/lib/rezact/signals"\n`
        );

      const mapStateUsedArr = Object.keys(mapStateUsed);
      if (mapStateUsedArr.length > 0)
        magicString.prepend(
          `import {${mapStateUsedArr.join(
            ","
          )}} from "src/lib/rezact/mapState"\n`
        );

      if (lastImport)
        magicString.appendRight(
          lastImport.end,
          `\n${functionsToRun.join("\n")}`
        );
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true }),
      };
    },
  };
}

export { rezact };

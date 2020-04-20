import { declare } from "@babel/helper-plugin-utils";


export default declare(api => {
  api.assertVersion(7);
  const t = api.types;

  return {
    name: "transform-property-prefix-symbol",

    visitor: {
      Program(path, { opts }) {
        if (!opts.prefix) return;

        const { node, scope } = path;
        const symbolFor = path.setData(
          "symbolFor",
          scope.generateUid("symbolFor")
        );
        node.body.unshift(t.identifier(`var ${symbolFor} = Symbol.for;`));
      },

      MemberExpression(path, { opts, file }) {
        if (!opts.prefix) return;

        const { node } = path;
        let { property } = node;
        if (node.computed || !property.name.startsWith(opts.prefix))
          return;

        const symbolFor = file.path.getData("symbolFor");
        property.name = `${symbolFor}("${property.name.replace(opts.prefix, '')}")`;
        node.computed = true;
      },
    },
  };
});

import { declare } from "@babel/helper-plugin-utils";


export default declare(api => {
  api.assertVersion(7);
  const t = api.types;

  return {
    name: "transform-property-prefix-symbol",

    visitor: {
      Program(path, { opts }) {
        if (!opts.prefixes) return;

        const { node, scope } = path;
        const symbolFor = path.setData(
          "symbolFor",
          scope.generateUid("symbolFor")
        );
        node.body.unshift(t.identifier(`var ${symbolFor} = Symbol.for;`));
      },

      MemberExpression(path, { opts, file }) {
        if (!opts.prefixes) return;

        const { node } = path;
        let { property } = node;
        if (node.computed)
          return;

        for (const prefix of opts.prefixes)
          if (property.name.startsWith(prefix)) {
            const symbolFor = file.path.getData("symbolFor");
            property.name = `${symbolFor}("${property.name}")`;
            node.computed = true;
            break;
          }
      },
    },
  };
});

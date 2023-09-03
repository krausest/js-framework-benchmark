/** @type {import("webpack").ModuleOptions["rules"]} */
const rules = [
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  },
];

export { rules };

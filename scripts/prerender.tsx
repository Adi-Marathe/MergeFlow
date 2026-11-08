import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { App } from "../src/App";

const indexPath = resolve(process.cwd(), "index.html");
const html = await readFile(indexPath, "utf8");
if (!html.includes("<!--ssr-start-->") || !html.includes("<!--ssr-end-->")) {
  throw new Error("Could not find the SSR outlet markers in index.html.");
}
const markup = renderToStaticMarkup(<App />);
const output = html.replace(
  /<!--ssr-start-->[\s\S]*?<!--ssr-end-->/,
  `<!--ssr-start-->${markup}<!--ssr-end-->`,
);

await writeFile(indexPath, output, "utf8");

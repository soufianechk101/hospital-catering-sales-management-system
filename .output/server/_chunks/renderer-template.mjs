import { HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";
//#region #nitro/virtual/renderer-template
var rendererTemplate = () => new HTTPResponse("<!doctype html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>dyad-generated-app</title>\r\n    <script type=\"module\" crossorigin src=\"/assets/index-D1EK_4ls.js\"><\/script>\n    <link rel=\"stylesheet\" crossorigin href=\"/assets/index-D637cL53.css\">\n  </head>\r\n\r\n  <body>\r\n    <div id=\"root\"></div>\r\r\n  </body>\r\n</html>\r\n", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { renderIndexHTML as default };

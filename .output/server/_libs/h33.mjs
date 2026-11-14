import { HTTPError, NullProtoObj, hasProp } from "./h3+rou3+srvx.mjs";
//#region node_modules/.pnpm/h3@2.0.8_crossws@0.4.17_srvx@1.0.8__ocache@0.3.1/node_modules/h3/dist/h3.mjs
function parseURLEncodedBody(body) {
	return collectEntries(new URLSearchParams(body).entries());
}
function parseFormData(form) {
	return collectEntries(form.entries());
}
function collectEntries(entries) {
	const parsed = new NullProtoObj();
	for (const [key, value] of entries) if (hasProp(parsed, key)) {
		if (!Array.isArray(parsed[key])) parsed[key] = [parsed[key]];
		parsed[key].push(value);
	} else parsed[key] = value;
	return parsed;
}
async function readBody(event, options) {
	const contentType = (event.req.headers.get("content-type") || "").toLowerCase();
	const type = options?.type;
	if (type === "formData") {
		let form;
		try {
			form = await event.req.formData();
		} catch (error) {
			if (HTTPError.isError(error)) throw error;
			throw new HTTPError({
				status: 400,
				statusText: "Bad Request",
				message: "Invalid form data body"
			});
		}
		return parseFormData(form);
	}
	const text = await event.req.text();
	if (type === "text") return text;
	if (!text) return;
	if (type === "urlencoded" || !type && contentType.startsWith("application/x-www-form-urlencoded")) return parseURLEncodedBody(text);
	try {
		return JSON.parse(text);
	} catch {
		throw new HTTPError({
			status: 400,
			statusText: "Bad Request",
			message: "Invalid JSON body"
		});
	}
}
//#endregion
export { readBody };

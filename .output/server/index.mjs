globalThis.__nitro_main__ = import.meta.url;
import { HTTPError, NodeResponse, serve } from "./_libs/h3+rou3+srvx.mjs";
import { H3Core, composeMiddleware, defineHandler, defineLazyEventHandler, defineMiddleware, toEventHandler } from "./_libs/h3.mjs";
import { createMatcherFromFind, headers, memoizeRouteRulesMatcher } from "./_libs/h34.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/polyfills/fast-response.mjs
if (globalThis.Response !== NodeResponse) globalThis.Response = NodeResponse;
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/_libs/hookable.mjs
function e$1(t, n, r, i) {
	for (let a = r; a < t.length; a += 1) try {
		let r = i ? i.run(() => t[a](...n)) : t[a](...n);
		if (r && typeof r.then == `function`) return Promise.resolve(r).then(() => e$1(t, n, a + 1, i));
	} catch (e) {
		return Promise.reject(e);
	}
}
var t$1 = class {
	_hooks;
	constructor() {
		this._hooks = {};
	}
	hook(e, t) {
		return !e || typeof t != `function` ? () => {} : (this._hooks[e] = this._hooks[e] || [], this._hooks[e].push(t), () => {
			t &&= (this.removeHook(e, t), void 0);
		});
	}
	removeHook(e, t) {
		let n = this._hooks[e];
		if (n) {
			let r = n.indexOf(t);
			r !== -1 && n.splice(r, 1), n.length === 0 && (this._hooks[e] = void 0);
		}
	}
	callHook(t, ...n) {
		let r = this._hooks[t];
		if (r && r.length !== 0) return e$1(r.slice(), n, 0);
	}
};
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/_libs/ufo.mjs
String.fromCharCode;
var e = /%2f/gi;
function t(e = ``) {
	try {
		return decodeURIComponent(`` + e);
	} catch {
		return `` + e;
	}
}
function n(n) {
	return t(n.replace(e, `%252F`));
}
var r = /\/$|\/\?|\/#/, i = /^\.?\//;
function a(e = ``, t) {
	return t ? r.test(e) : e.endsWith(`/`);
}
function o(e = ``, t) {
	if (!t) return (a(e) ? e.slice(0, -1) : e) || `/`;
	if (!a(e, !0)) return e || `/`;
	let n = e, r = ``, i = e.indexOf(`#`);
	i !== -1 && (n = e.slice(0, i), r = e.slice(i));
	let [o, ...s] = n.split(`?`);
	return ((o.endsWith(`/`) ? o.slice(0, -1) : o) || `/`) + (s.length > 0 ? `?${s.join(`?`)}` : ``) + r;
}
function s(e = ``, t) {
	if (!t) return e.endsWith(`/`) ? e : e + `/`;
	if (a(e, !0)) return e || `/`;
	let n = e, r = ``, i = e.indexOf(`#`);
	if (i !== -1 && (n = e.slice(0, i), r = e.slice(i), !n)) return r;
	let [o, ...s] = n.split(`?`);
	return o + `/` + (s.length > 0 ? `?${s.join(`?`)}` : ``) + r;
}
function c(e = ``) {
	return e.startsWith(`/`);
}
function l(e = ``) {
	return c(e) ? e : `/` + e;
}
function u(e) {
	return e && e !== `/`;
}
function d(e, ...t) {
	let n = e || ``;
	for (let e of t.filter((e) => u(e))) if (n) {
		let t = e.replace(i, ``);
		n = s(n) + t;
	} else n = e;
	return n;
}
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/index-D1EK_4ls.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5489f-QF7ttE/QJdO5Ijc3Nob4Th7vXPA\"",
		"mtime": "2026-11-08T01:37:41.669Z",
		"size": 346271,
		"path": "../public/assets/index-D1EK_4ls.js"
	},
	"/assets/index-D637cL53.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"eaaa-cf+tneZc2+qZxLkBt51dW32K1uI\"",
		"mtime": "2026-11-08T01:37:41.670Z",
		"size": 60074,
		"path": "../public/assets/index-D637cL53.css"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"15f09-4MFHRo4azA6knOGNmsefGO+QUAE\"",
		"mtime": "2026-11-07T01:47:56.037Z",
		"size": 89865,
		"path": "../public/favicon.ico"
	},
	"/placeholder.svg": {
		"type": "image/svg+xml",
		"etag": "\"cb5-3cfZ/x0uNhX4kurZGAkOBE4K/G0\"",
		"mtime": "2026-11-07T01:47:56.037Z",
		"size": 3253,
		"path": "../public/placeholder.svg"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-11-07T01:47:56.053Z",
		"size": 174,
		"path": "../public/robots.txt"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path)).catch((error) => {
		if (error?.code !== "ENOENT") throw error;
	});
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = { "/assets/": { "maxAge": 31536e3 } };
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
function hasAsset(id = "") {
	return !!(public_assets_data_default[id] || public_assets_data_default[id + ".gz"] || public_assets_data_default[id + ".br"] || public_assets_data_default[id + ".zst"]);
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var noCacheHeaders = { "cache-control": "no-store" };
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	const path = l(o(event.url.pathname));
	let id = path.includes("%") ? n(path) : path;
	if (!hasAsset(id) && !hasAsset(d(id, "index.html")) && !isPublicAssetURL(id)) return;
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((entry) => {
		const [name, ...parameters] = entry.split(";");
		const quality = parameters.map((parameter) => parameter.trim().split("=")).find(([key]) => key.toLowerCase() === "q")?.[1];
		const weight = quality === void 0 ? 1 : Number.parseFloat(quality);
		return {
			ext: EncodingMap[name.trim().toLowerCase()],
			weight: Number.isNaN(weight) ? 1 : weight
		};
	}).filter((entry) => entry.ext && entry.weight > 0).sort((a, b) => b.weight - a.weight || (a.ext < b.ext ? -1 : a.ext > b.ext ? 1 : 0)).map((entry) => entry.ext), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, d(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) throw new HTTPError({
			status: 404,
			headers: noCacheHeaders
		});
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	const data = readAsset(id);
	return typeof data?.then === "function" ? data.then((resolved) => assertAssetData(resolved)) : assertAssetData(data);
});
function assertAssetData(data) {
	if (data === null || data === void 0) throw new HTTPError({
		status: 404,
		headers: noCacheHeaders
	});
	return data;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/utils.mjs
function createErrorHeaders(error, event, unhandled) {
	const headers = new Headers(unhandled ? {} : error.headers);
	const errHeaders = event.res?.errHeaders;
	if (errHeaders) for (const [name, value] of errHeaders) if (name === "set-cookie") headers.append(name, value);
	else headers.set(name, value);
	return headers;
}
//#endregion
//#region server/database/db.ts
var pool = new Pool({
	host: process.env.PGHOST || "localhost",
	port: parseInt(process.env.PGPORT || "5432"),
	database: process.env.PGDATABASE || "medicatering",
	user: process.env.PGUSER || "postgres",
	password: process.env.PGPASSWORD || "postgres"
});
async function query(text, params) {
	const start = Date.now();
	const result = await pool.query(text, params);
	const duration = Date.now() - start;
	console.log("Executed query", {
		text,
		duration,
		rows: result.rowCount
	});
	return result;
}
//#endregion
//#region server/middleware/audit.ts
var audit_default = defineMiddleware(async (event, handler) => {
	handler(event);
	const method = event.node.req.method;
	if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") {
		const user = event.context.user;
		if (user) {
			const entityMatch = (event.node.req.url || "").match(/\/api\/([^\/]+)/);
			if (entityMatch) {
				const entity = entityMatch[1];
				try {
					await query(`INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)`, [
						user.id,
						method,
						entity,
						0,
						event.node.req.socket.remoteAddress || "",
						event.node.req.headers["user-agent"] || ""
					]);
				} catch (e) {
					console.error("Audit log error:", e);
				}
			}
		}
	}
});
//#endregion
//#region server/middleware/auth.ts
var JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";
var auth_default = defineMiddleware(async (event, handler) => {
	const authHeader = event.node.req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.substring(7);
		try {
			const result = await query("SELECT id, username, email, full_name, role, is_active FROM users WHERE id = $1", [jwt.verify(token, JWT_SECRET).userId]);
			if (result.rows.length > 0 && result.rows[0].is_active) event.context.user = result.rows[0];
		} catch (error) {}
	}
	handler(event);
});
//#endregion
//#region server/middleware/permissions.ts
var permissions_default = defineMiddleware(async (event, handler) => {
	const user = event.context.user;
	const url = event.node.req.url || "";
	event.node.req.method;
	if (url.includes("/auth/login") || url.includes("/auth/logout") || url.includes("/auth/me")) return handler(event);
	if (!user) {
		event.node.res.statusCode = 401;
		event.node.res.setHeader("Content-Type", "application/json");
		event.node.res.end(JSON.stringify({
			success: false,
			message: "Authentification requise"
		}));
		return;
	}
	const siteIdMatch = url.match(/\/sites\/(\d+)/);
	const subSiteIdMatch = url.match(/\/sub-sites\/(\d+)/);
	const subSiteIdParamMatch = url.match(/sub_site_id=(\d+)/);
	if (siteIdMatch) {
		const siteId = parseInt(siteIdMatch[1]);
		if ((await query("SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2", [user.id, siteId])).rows.length === 0 && user.role !== "SUPER_ADMIN") {
			event.node.res.statusCode = 403;
			event.node.res.setHeader("Content-Type", "application/json");
			event.node.res.end(JSON.stringify({
				success: false,
				message: "Accès refusé à ce site"
			}));
			return;
		}
	}
	if (subSiteIdMatch) {
		const subSiteId = parseInt(subSiteIdMatch[1]);
		if ((await query("SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2", [user.id, subSiteId])).rows.length === 0 && user.role !== "SUPER_ADMIN") {
			event.node.res.statusCode = 403;
			event.node.res.setHeader("Content-Type", "application/json");
			event.node.res.end(JSON.stringify({
				success: false,
				message: "Accès refusé à ce sous-site"
			}));
			return;
		}
	}
	if (subSiteIdParamMatch) {
		const subSiteId = parseInt(subSiteIdParamMatch[1]);
		if ((await query("SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2", [user.id, subSiteId])).rows.length === 0 && user.role !== "SUPER_ADMIN") {
			event.node.res.statusCode = 403;
			event.node.res.setHeader("Content-Type", "application/json");
			event.node.res.end(JSON.stringify({
				success: false,
				message: "Accès refusé à ce sous-site"
			}));
			return;
		}
	}
	handler(event);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = {
		route: "/assets/**",
		rank: 0,
		rules: [{
			name: "headers",
			route: "/assets/**",
			handler: headers,
			options: { "cache-control": "public, max-age=31536000, immutable" }
		}]
	};
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
		let s = p.split("/");
		let l = s.length;
		let _w;
		if (l > 1) {
			if (s[1] === "assets") r.push(l > 2 ? {
				data: $0,
				params: {
					"0": _w = p.slice(8),
					_: _w
				}
			} : {
				data: $0,
				params: {}
			});
		}
		return r.reverse();
	};
})();
var _lazy_5c925401ee1b2277 = defineLazyEventHandler(() => import("./_routes/api/audit_logs.mjs"));
var _lazy_cb5ddab0eddf62bf = defineLazyEventHandler(() => import("./_routes/api/auth/login.mjs"));
var _lazy_427179fe8347ae7f = defineLazyEventHandler(() => import("./_routes/api/auth/logout.mjs"));
var _lazy_04bad8b963f2683c = defineLazyEventHandler(() => import("./_routes/api/auth/me.mjs"));
var _lazy_b3e36dcd0db2ac6e = defineLazyEventHandler(() => import("./_id_.delete.mjs"));
var _lazy_198e546049c3ee6d = defineLazyEventHandler(() => import("./_id_.get.mjs"));
var _lazy_53c404beb617239b = defineLazyEventHandler(() => import("./_id_.put.mjs"));
var _lazy_6336520ce2a65c9d = defineLazyEventHandler(() => import("./_routes/api/daily_records/by_sub_site.mjs"));
var _lazy_fd8fe47548756c10 = defineLazyEventHandler(() => import("./_routes/api/daily_records/create.mjs"));
var _lazy_5bd4a0cfb3b276d9 = defineLazyEventHandler(() => import("./_routes/api/dashboard/revenue_by_category.mjs"));
var _lazy_e357109c3239706e = defineLazyEventHandler(() => import("./_routes/api/dashboard/revenue_by_day.mjs"));
var _lazy_3b0a88fd9d9ac2e1 = defineLazyEventHandler(() => import("./_routes/api/dashboard/revenue_by_meal_period.mjs"));
var _lazy_6018009df3e6ff80 = defineLazyEventHandler(() => import("./_routes/api/dashboard/revenue_by_site.mjs"));
var _lazy_a027f7417a4ab879 = defineLazyEventHandler(() => import("./_routes/api/dashboard/stats.mjs"));
var _lazy_43110e927001f95d = defineLazyEventHandler(() => import("./_routes/api/journals/global.mjs"));
var _lazy_07080d51125c23c1 = defineLazyEventHandler(() => import("./_routes/api/journals/main_site.mjs"));
var _lazy_1aab67f1a6893a13 = defineLazyEventHandler(() => import("./_routes/api/journals/sub_site.mjs"));
var _lazy_f5d0bc607e67de34 = defineLazyEventHandler(() => import("./_routes/api/meal_categories.mjs"));
var _lazy_a792de091b634969 = defineLazyEventHandler(() => import("./_routes/api/meal_periods.mjs"));
var _lazy_f8e096cde88d574f = defineLazyEventHandler(() => import("./_id_2.delete.mjs"));
var _lazy_7cf6c6a8de346ea1 = defineLazyEventHandler(() => import("./_id_2.put.mjs"));
var _lazy_796246df993d486c = defineLazyEventHandler(() => import("./_routes/api/prices/create.mjs"));
var _lazy_dccd98232f60b31e = defineLazyEventHandler(() => import("./_routes/api/prices.mjs"));
var _lazy_0819807beb1360c8 = defineLazyEventHandler(() => import("./_routes/api/reports/generate.mjs"));
var _lazy_0ebf81fbedc092d8 = defineLazyEventHandler(() => import("./_id_3.delete.mjs"));
var _lazy_eca3ac10c00307dd = defineLazyEventHandler(() => import("./_id_2.get.mjs"));
var _lazy_2d73e9284d84c384 = defineLazyEventHandler(() => import("./_id_3.put.mjs"));
var _lazy_62755f20cc77a0f3 = defineLazyEventHandler(() => import("./_routes/api/services/create.mjs"));
var _lazy_343a0303ee12c799 = defineLazyEventHandler(() => import("./_routes/api/services.mjs"));
var _lazy_c981ca56f56dc1b1 = defineLazyEventHandler(() => import("./_id_4.delete.mjs"));
var _lazy_d0730587b2eb4a5a = defineLazyEventHandler(() => import("./_id_3.get.mjs"));
var _lazy_bfe0bcde6a23c947 = defineLazyEventHandler(() => import("./_id_4.put.mjs"));
var _lazy_e47c33c3cf3d849e = defineLazyEventHandler(() => import("./_routes/api/sites/create.mjs"));
var _lazy_c02158503e5617a1 = defineLazyEventHandler(() => import("./_routes/api/sites.mjs"));
var _lazy_27582c8dbb83f95f = defineLazyEventHandler(() => import("./_id_5.delete.mjs"));
var _lazy_5365a3e24779d95a = defineLazyEventHandler(() => import("./_id_4.get.mjs"));
var _lazy_002ce0414290b88d = defineLazyEventHandler(() => import("./_id_5.put.mjs"));
var _lazy_4a2042c47d7ce4d1 = defineLazyEventHandler(() => import("./_routes/api/sub_sites/create.mjs"));
var _lazy_c9b5b0375e815987 = defineLazyEventHandler(() => import("./_routes/api/sub_sites.mjs"));
var _lazy_e0358e0dad649557 = defineLazyEventHandler(() => import("./_routes/api/users/create.mjs"));
var _lazy_ee56fa222245a4f3 = defineLazyEventHandler(() => import("./_routes/api/users.mjs"));
var _lazy_c654a44c65b7655b = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const $27 = {
		__proto__: null,
		"/api/audit-logs": {
			__proto__: null,
			"GET": {
				route: "/api/audit-logs",
				method: "get",
				handler: _lazy_5c925401ee1b2277
			}
		},
		"/api/auth/login": {
			__proto__: null,
			"POST": {
				route: "/api/auth/login",
				method: "post",
				handler: _lazy_cb5ddab0eddf62bf
			}
		},
		"/api/auth/logout": {
			__proto__: null,
			"POST": {
				route: "/api/auth/logout",
				method: "post",
				handler: _lazy_427179fe8347ae7f
			}
		},
		"/api/auth/me": {
			__proto__: null,
			"GET": {
				route: "/api/auth/me",
				method: "get",
				handler: _lazy_04bad8b963f2683c
			}
		},
		"/api/daily-records/by-sub-site": {
			__proto__: null,
			"GET": {
				route: "/api/daily-records/by-sub-site",
				method: "get",
				handler: _lazy_6336520ce2a65c9d
			}
		},
		"/api/daily-records/create": {
			__proto__: null,
			"POST": {
				route: "/api/daily-records/create",
				method: "post",
				handler: _lazy_fd8fe47548756c10
			}
		},
		"/api/dashboard/revenue-by-category": {
			__proto__: null,
			"GET": {
				route: "/api/dashboard/revenue-by-category",
				method: "get",
				handler: _lazy_5bd4a0cfb3b276d9
			}
		},
		"/api/dashboard/revenue-by-day": {
			__proto__: null,
			"GET": {
				route: "/api/dashboard/revenue-by-day",
				method: "get",
				handler: _lazy_e357109c3239706e
			}
		},
		"/api/dashboard/revenue-by-meal-period": {
			__proto__: null,
			"GET": {
				route: "/api/dashboard/revenue-by-meal-period",
				method: "get",
				handler: _lazy_3b0a88fd9d9ac2e1
			}
		},
		"/api/dashboard/revenue-by-site": {
			__proto__: null,
			"GET": {
				route: "/api/dashboard/revenue-by-site",
				method: "get",
				handler: _lazy_6018009df3e6ff80
			}
		},
		"/api/dashboard/stats": {
			__proto__: null,
			"GET": {
				route: "/api/dashboard/stats",
				method: "get",
				handler: _lazy_a027f7417a4ab879
			}
		},
		"/api/journals/global": {
			__proto__: null,
			"GET": {
				route: "/api/journals/global",
				method: "get",
				handler: _lazy_43110e927001f95d
			}
		},
		"/api/journals/main-site": {
			__proto__: null,
			"GET": {
				route: "/api/journals/main-site",
				method: "get",
				handler: _lazy_07080d51125c23c1
			}
		},
		"/api/journals/sub-site": {
			__proto__: null,
			"GET": {
				route: "/api/journals/sub-site",
				method: "get",
				handler: _lazy_1aab67f1a6893a13
			}
		},
		"/api/meal-categories": {
			__proto__: null,
			"GET": {
				route: "/api/meal-categories",
				method: "get",
				handler: _lazy_f5d0bc607e67de34
			}
		},
		"/api/meal-periods": {
			__proto__: null,
			"GET": {
				route: "/api/meal-periods",
				method: "get",
				handler: _lazy_a792de091b634969
			}
		},
		"/api/prices/create": {
			__proto__: null,
			"POST": {
				route: "/api/prices/create",
				method: "post",
				handler: _lazy_796246df993d486c
			}
		},
		"/api/prices": {
			__proto__: null,
			"GET": {
				route: "/api/prices",
				method: "get",
				handler: _lazy_dccd98232f60b31e
			}
		},
		"/api/reports/generate": {
			__proto__: null,
			"POST": {
				route: "/api/reports/generate",
				method: "post",
				handler: _lazy_0819807beb1360c8
			}
		},
		"/api/services/create": {
			__proto__: null,
			"POST": {
				route: "/api/services/create",
				method: "post",
				handler: _lazy_62755f20cc77a0f3
			}
		},
		"/api/services": {
			__proto__: null,
			"GET": {
				route: "/api/services",
				method: "get",
				handler: _lazy_343a0303ee12c799
			}
		},
		"/api/sites/create": {
			__proto__: null,
			"POST": {
				route: "/api/sites/create",
				method: "post",
				handler: _lazy_e47c33c3cf3d849e
			}
		},
		"/api/sites": {
			__proto__: null,
			"GET": {
				route: "/api/sites",
				method: "get",
				handler: _lazy_c02158503e5617a1
			}
		},
		"/api/sub-sites/create": {
			__proto__: null,
			"POST": {
				route: "/api/sub-sites/create",
				method: "post",
				handler: _lazy_4a2042c47d7ce4d1
			}
		},
		"/api/sub-sites": {
			__proto__: null,
			"GET": {
				route: "/api/sub-sites",
				method: "get",
				handler: _lazy_c9b5b0375e815987
			}
		},
		"/api/users/create": {
			__proto__: null,
			"POST": {
				route: "/api/users/create",
				method: "post",
				handler: _lazy_e0358e0dad649557
			}
		},
		"/api/users": {
			__proto__: null,
			"GET": {
				route: "/api/users",
				method: "get",
				handler: _lazy_ee56fa222245a4f3
			}
		}
	}, $28 = {
		route: "/api/daily-records/:id",
		method: "delete",
		handler: _lazy_b3e36dcd0db2ac6e
	}, $29 = {
		route: "/api/daily-records/:id",
		method: "get",
		handler: _lazy_198e546049c3ee6d
	}, $30 = {
		route: "/api/daily-records/:id",
		method: "put",
		handler: _lazy_53c404beb617239b
	}, $31 = {
		route: "/api/prices/:id",
		method: "delete",
		handler: _lazy_f8e096cde88d574f
	}, $32 = {
		route: "/api/prices/:id",
		method: "put",
		handler: _lazy_7cf6c6a8de346ea1
	}, $33 = {
		route: "/api/services/:id",
		method: "delete",
		handler: _lazy_0ebf81fbedc092d8
	}, $34 = {
		route: "/api/services/:id",
		method: "get",
		handler: _lazy_eca3ac10c00307dd
	}, $35 = {
		route: "/api/services/:id",
		method: "put",
		handler: _lazy_2d73e9284d84c384
	}, $36 = {
		route: "/api/sites/:id",
		method: "delete",
		handler: _lazy_c981ca56f56dc1b1
	}, $37 = {
		route: "/api/sites/:id",
		method: "get",
		handler: _lazy_d0730587b2eb4a5a
	}, $38 = {
		route: "/api/sites/:id",
		method: "put",
		handler: _lazy_bfe0bcde6a23c947
	}, $39 = {
		route: "/api/sub-sites/:id",
		method: "delete",
		handler: _lazy_27582c8dbb83f95f
	}, $40 = {
		route: "/api/sub-sites/:id",
		method: "get",
		handler: _lazy_5365a3e24779d95a
	}, $41 = {
		route: "/api/sub-sites/:id",
		method: "put",
		handler: _lazy_002ce0414290b88d
	}, $42 = {
		route: "/**",
		handler: _lazy_c654a44c65b7655b
	};
	return (m, p) => {
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1);
		let _n = $27[p];
		if (_n !== void 0) {
			let _d = _n[m];
			if (_d === void 0) _d = _n[""];
			if (_d !== void 0) return { data: _d };
		}
		let s = p.split("/");
		let l = s.length;
		let _w;
		if (l > 1) {
			if (s[1] === "api") {
				if (l > 2) {
					if (s[2] === "daily-records") {
						if (l === 4) {
							if (m === "DELETE") {
								if (s[3]) return {
									data: $28,
									params: { "id": s[3] }
								};
							} else if (m === "GET") {
								if (s[3]) return {
									data: $29,
									params: { "id": s[3] }
								};
							} else if (m === "PUT") {
								if (s[3]) return {
									data: $30,
									params: { "id": s[3] }
								};
							}
						}
					} else if (s[2] === "prices") {
						if (l === 4) {
							if (m === "DELETE") {
								if (s[3]) return {
									data: $31,
									params: { "id": s[3] }
								};
							} else if (m === "PUT") {
								if (s[3]) return {
									data: $32,
									params: { "id": s[3] }
								};
							}
						}
					} else if (s[2] === "services") {
						if (l === 4) {
							if (m === "DELETE") {
								if (s[3]) return {
									data: $33,
									params: { "id": s[3] }
								};
							} else if (m === "GET") {
								if (s[3]) return {
									data: $34,
									params: { "id": s[3] }
								};
							} else if (m === "PUT") {
								if (s[3]) return {
									data: $35,
									params: { "id": s[3] }
								};
							}
						}
					} else if (s[2] === "sites") {
						if (l === 4) {
							if (m === "DELETE") {
								if (s[3]) return {
									data: $36,
									params: { "id": s[3] }
								};
							} else if (m === "GET") {
								if (s[3]) return {
									data: $37,
									params: { "id": s[3] }
								};
							} else if (m === "PUT") {
								if (s[3]) return {
									data: $38,
									params: { "id": s[3] }
								};
							}
						}
					} else if (s[2] === "sub-sites") {
						if (l === 4) {
							if (m === "DELETE") {
								if (s[3]) return {
									data: $39,
									params: { "id": s[3] }
								};
							} else if (m === "GET") {
								if (s[3]) return {
									data: $40,
									params: { "id": s[3] }
								};
							} else if (m === "PUT") {
								if (s[3]) return {
									data: $41,
									params: { "id": s[3] }
								};
							}
						}
					}
				}
			}
		}
		return l > 1 ? {
			data: $42,
			params: {
				"0": _w = p.slice(1),
				_: _w
			}
		} : {
			data: $42,
			params: {}
		};
	};
})();
var globalMiddleware = [
	toEventHandler(static_default),
	toEventHandler(audit_default),
	toEventHandler(auth_default),
	toEventHandler(permissions_default)
].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = createErrorHeaders(error, event, unhandled);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function initNitroPlugins(app) {
	return app;
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => {
		event.context.routeRules = getRouteRules(event.req.method, event.url.pathname).routeRules;
		if (event.req.method === "HEAD") {
			const route = findRoute("HEAD", event.url.pathname);
			return route?.data.method ? route : findRoute("GET", event.url.pathname);
		}
		return findRoute(event.req.method, event.url.pathname) ?? findMethodNotAllowed(event.req.method, event.url.pathname);
	};
	const findMethodNotAllowed = createMethodNotAllowedMatcher(findRoute, [
		"DELETE",
		"GET",
		"POST",
		"PUT"
	]);
	h3App["~middleware"].push(createRouteRulesMiddleware());
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~middleware"].push(createCacheRuleMiddleware());
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	initNitroPlugins(instance);
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new t$1();
}
function getRouteRules(method, pathname) {
	return matchRouteRules(method, pathname);
}
function createRouteRulesMiddleware() {
	const middleware = (event, next) => {
		const { rules, cache } = resolveRouteRuleChains(event.req.method, event.url.pathname);
		if (cache) event[kCacheRule] = cache;
		return rules ? rules(event, next) : next();
	};
	return markUntraced(middleware);
}
function createCacheRuleMiddleware() {
	const middleware = (event, next) => {
		const cache = event[kCacheRule];
		return cache ? cache(event, next) : next();
	};
	return markUntraced(middleware);
}
function createMethodNotAllowedMatcher(findRoute, methods) {
	return (method, pathname) => {
		let allow;
		for (const m of methods) if (m !== method && findRoute(m, pathname)) allow = allow ? `${allow}, ${m}` : m;
		if (!allow) return;
		return { data: { handler: () => new HTTPError({
			status: 405,
			statusText: "Method Not Allowed",
			message: `Method ${method} is not allowed for ${pathname} (allowed: ${allow})`,
			headers: { allow }
		}) } };
	};
}
var _matchRouteRules;
function matchRouteRules(method, pathname) {
	return (_matchRouteRules ??= memoizeRouteRulesMatcher(createMatcherFromFind(findRouteRules)))(method, pathname);
}
var kCacheRule = /* @__PURE__ */ Symbol("nitro.cacheRule");
var _routeRuleChains = /* @__PURE__ */ new WeakMap();
function resolveRouteRuleChains(method, pathname) {
	const { matchedRules, routeRuleMiddleware } = matchRouteRules(method, pathname);
	if (routeRuleMiddleware.length === 0) return {};
	let chains = _routeRuleChains.get(routeRuleMiddleware);
	if (!chains) {
		const hasCache = !!matchedRules.cache?.handler;
		const rules = hasCache ? routeRuleMiddleware.slice(0, -1) : routeRuleMiddleware;
		chains = {
			rules: rules.length > 0 ? composeMiddleware(rules) : void 0,
			cache: hasCache ? routeRuleMiddleware.at(-1) : void 0
		};
		_routeRuleChains.set(routeRuleMiddleware, chains);
	}
	return chains;
}
function markUntraced(middleware) {
	middleware.__traced__ = true;
	return middleware;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/server-entry
var serverEntryOptions = {};
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/serve.mjs
function resolveServeOptions(opts) {
	const { port, hostname, tls, ...entryOptions } = serverEntryOptions;
	const env = globalThis.process?.env || {};
	const _parsedPort = Number.parseInt(env.NITRO_PORT ?? env.PORT ?? "");
	const cert = env.NITRO_SSL_CERT;
	const key = env.NITRO_SSL_KEY;
	const socketPath = env.NITRO_UNIX_SOCKET;
	const resolved = {
		...entryOptions,
		port: Number.isNaN(_parsedPort) ? port ?? 3e3 : _parsedPort,
		hostname: env.NITRO_HOST || env.HOST || hostname,
		tls: cert && key ? {
			cert,
			key
		} : tls,
		...opts,
		plugins: [...tracingSrvxPlugins, ...opts.plugins || []]
	};
	for (const runtime of [
		"node",
		"bun",
		"deno"
	]) if (entryOptions[runtime] && opts[runtime]) resolved[runtime] = {
		...entryOptions[runtime],
		...opts[runtime]
	};
	if (socketPath) {
		resolved.node = {
			...resolved.node,
			path: socketPath
		};
		resolved.bun = {
			...resolved.bun,
			unix: socketPath
		};
		resolved.deno = {
			...resolved.deno,
			path: socketPath
		};
	}
	return resolved;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/runtime/internal/shutdown.mjs
function setupCloseHooks(server) {
	const closeServer = server.close.bind(server);
	let closeHooks;
	server.close = (closeActiveConnections) => closeServer(closeActiveConnections).finally(() => closeHooks ??= callCloseHooks());
}
async function callCloseHooks() {
	try {
		await useNitroHooks().callHook("close");
	} catch (error) {
		console.error("[nitro] Error while calling `close` hooks:", error);
	}
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.261103-rc/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var server = serve(resolveServeOptions({ fetch: useNitroApp().fetch }));
server.ready().catch((error) => {
	console.error("[nitro] Failed to start server:", error);
	process.exit(1);
});
setupCloseHooks(server);
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default, query };

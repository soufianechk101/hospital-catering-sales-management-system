import { H3Event, HTTPError, kMalformedURL, kNotFound, toError, toResponse } from "./h3+rou3+srvx.mjs";
//#region node_modules/.pnpm/h3@2.0.8_crossws@0.4.17_srvx@1.0.8__ocache@0.3.1/node_modules/h3/dist/middleware.mjs
function defineMiddleware(input) {
	return input;
}
function composeMiddleware(middleware) {
	let chain = (event, handler) => handler(event);
	for (let i = middleware.length - 1; i >= 0; i--) {
		const fn = middleware[i];
		const inner = chain;
		chain = (event, handler) => callLayer(fn, event, handler, inner);
	}
	return chain;
}
function composeHandler(middleware, handler) {
	const chain = composeMiddleware(middleware);
	return function _composedHandler(event) {
		return chain(event, handler);
	};
}
function callMiddleware(event, middleware, handler, index = 0) {
	return index === middleware.length ? handler(event) : callLayer(middleware[index], event, handler, (_event, _handler) => callMiddleware(_event, middleware, _handler, index + 1));
}
function callLayer(fn, event, handler, inner) {
	let nextCalled;
	let nextResult;
	const next = () => {
		if (nextCalled) return nextResult;
		nextCalled = true;
		nextResult = inner(event, handler);
		return nextResult;
	};
	const ret = fn(event, next);
	return isUnhandledResponse(ret) ? next() : typeof ret?.then === "function" ? ret.then((resolved) => isUnhandledResponse(resolved) ? next() : resolved) : ret;
}
function isUnhandledResponse(val) {
	return val === void 0 || val === kNotFound;
}
//#endregion
//#region node_modules/.pnpm/h3@2.0.8_crossws@0.4.17_srvx@1.0.8__ocache@0.3.1/node_modules/h3/dist/cache.mjs
function defineHandler(input) {
	if (typeof input === "function") return handlerWithFetch(input);
	const handler = input.handler || (input.fetch ? function _fetchHandler(event) {
		return input.fetch(event.req);
	} : NoHandler);
	const composed = input.middleware?.length && composeHandler(input.middleware, handler);
	const eventHandler = handlerWithFetch(composed || handler);
	return Object.assign(eventHandler, input, composed && { fetch: eventHandler.fetch });
}
function handlerWithFetch(handler) {
	if ("fetch" in handler) return handler;
	return Object.assign(handler, { fetch: (req) => {
		if (typeof req === "string") req = new URL(req, "http://_");
		if (req instanceof URL) req = new Request(req);
		const event = new H3Event(req);
		try {
			return Promise.resolve(toResponse(handler(event), event));
		} catch (error) {
			return Promise.resolve(toResponse(toError(error), event));
		}
	} });
}
function defineLazyEventHandler(loader) {
	let handler;
	let promise;
	return defineHandler(function lazyHandler(event) {
		return handler ? handler(event) : (promise ??= Promise.resolve(loader()).then(function resolveLazyHandler(r) {
			handler = toEventHandler(r) || toEventHandler(r.default);
			if (typeof handler !== "function") throw new TypeError("Invalid lazy handler", { cause: { resolved: r } });
			return handler;
		})).then((r) => r(event));
	});
}
function toEventHandler(handler) {
	if (typeof handler === "function") return handler;
	if (typeof handler?.handler === "function" && handler.constructor?.["~h3"]) return handler.handler;
	if (typeof handler?.fetch === "function") return function _fetchHandler(event) {
		return handler.fetch(event.req);
	};
}
var NoHandler = () => kNotFound;
var H3Core = class {
	static "~h3" = true;
	config;
	"~middleware";
	"~routes" = [];
	"~dispatch";
	"~composed";
	constructor(config = {}) {
		this["~middleware"] = [];
		this.config = config;
		this.fetch = this.fetch.bind(this);
		this.handler = this.handler.bind(this);
	}
	fetch(request) {
		return this["~request"](request);
	}
	handler(event) {
		const route = this["~findRoute"](event);
		if (route) {
			event.context.params = route.params;
			event.context.matchedRoute = route.data;
		}
		return (this["~dispatch"] ??= createDispatcher(this))(event, route);
	}
	"~request"(request, context) {
		const event = new H3Event(request, context, this);
		let handlerRes;
		try {
			if (event[kMalformedURL] && !this.config.allowMalformedURL) throw new HTTPError({
				status: 400,
				message: "Bad Request"
			});
			if (this.config.onRequest) {
				const hookRes = this.config.onRequest(event);
				handlerRes = typeof hookRes?.then === "function" ? hookRes.then(() => this.handler(event)) : this.handler(event);
			} else handlerRes = this.handler(event);
		} catch (error) {
			handlerRes = Promise.reject(error);
		}
		return toResponse(handlerRes, event, this.config);
	}
	"~findRoute"(_event) {}
	"~addRoute"(_route) {
		this["~routes"].push(_route);
	}
	"~getMiddleware"(_event, _route) {
		return this["~middleware"];
	}
};
function createDispatcher(app) {
	if (app["~getMiddleware"] !== H3Core.prototype["~getMiddleware"]) return (event, route) => callMiddleware(event, app["~getMiddleware"](event, route || void 0), routeHandler(route));
	const middleware = app["~middleware"];
	if (middleware.length === 0) return (event, route) => routeHandler(route)(event);
	const composed = app["~composed"] ??= composeMiddleware(middleware);
	return (event, route) => composed(event, routeHandler(route));
}
function routeHandler(route) {
	const data = route?.data;
	if (!data) return NoHandler;
	return data.middleware?.length ? data["~composed"] ??= composeHandler(data.middleware, data.handler) : data.handler;
}
//#endregion
export { H3Core, composeMiddleware, defineHandler, defineLazyEventHandler, defineMiddleware, toEventHandler };

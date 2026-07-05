//#region \0@oxc-project+runtime@0.138.0/helpers/esm/typeof.js
function e(t) {
	"@babel/helpers - typeof";
	return e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, e(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/toPrimitive.js
function t(t, n) {
	if (e(t) != "object" || !t) return t;
	var r = t[Symbol.toPrimitive];
	if (r !== void 0) {
		var i = r.call(t, n || "default");
		if (e(i) != "object") return i;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (n === "string" ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/toPropertyKey.js
function n(n) {
	var r = t(n, "string");
	return e(r) == "symbol" ? r : r + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/defineProperty.js
function r(e, t, r) {
	return (t = n(t)) in e ? Object.defineProperty(e, t, {
		value: r,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = r, e;
}
//#endregion
//#region src/dynamic-map-card.ts
var i = "0.1.2", a = /* @__PURE__ */ new Set([
	"mode_entity",
	"modes",
	"default_mode",
	"debug"
]), o = /* @__PURE__ */ new Set([
	"light",
	"dark",
	"auto"
]), s = class extends HTMLElement {
	constructor(...e) {
		super(...e), r(this, "_config", void 0), r(this, "_hass", void 0), r(this, "_card", void 0), r(this, "_lastThemeMode", void 0), r(this, "_helpers", void 0), r(this, "_loadPromise", void 0), r(this, "_lastNativeConfig", void 0);
	}
	setConfig(e) {
		c(e), this._config = e, this._lastThemeMode = void 0, this._lastNativeConfig = void 0, this._ensureCard();
	}
	set hass(e) {
		if (this._hass = e, !this._config) return;
		let t = u(this._config, e);
		if (t !== this._lastThemeMode) {
			this._lastThemeMode = t, this._ensureCard();
			return;
		}
		this._card && (this._card.hass = e);
	}
	getCardSize() {
		var e, t, n;
		return (e = (t = this._card) == null || (n = t.getCardSize) == null ? void 0 : n.call(t)) == null ? 3 : e;
	}
	async _ensureCard() {
		this._loadPromise && await this._loadPromise, this._loadPromise = this._createOrUpdateCard(), await this._loadPromise, this._loadPromise = void 0;
	}
	async _createOrUpdateCard() {
		var e;
		if (!this._config) return;
		let t = l(this._config, this._hass);
		if (!this._helpers) {
			if (!window.loadCardHelpers) throw Error("dynamic-map-card requires Home Assistant card helpers.");
			this._helpers = await window.loadCardHelpers();
		}
		let n = this._helpers.createCardElement(t);
		(e = n.setConfig) == null || e.call(n, t), this._hass && (n.hass = this._hass), this.replaceChildren(n), this._card = n, this._lastNativeConfig = t, this._lastThemeMode = t.theme_mode, m(this._config, t, this._hass);
	}
};
function c(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("dynamic-map-card config must be an object.");
	if (e.mode_entity !== void 0 && typeof e.mode_entity != "string") throw Error("dynamic-map-card mode_entity must be a string.");
	if (e.modes !== void 0) {
		if (!f(e.modes)) throw Error("dynamic-map-card modes must be an object mapping entity states to light, dark, or auto.");
		for (let [t, n] of Object.entries(e.modes)) if (!p(n)) throw Error(`dynamic-map-card modes.${t} must be light, dark, or auto.`);
	}
	if (e.default_mode !== void 0 && !p(e.default_mode)) throw Error("dynamic-map-card default_mode must be light, dark, or auto.");
	if (e.debug !== void 0 && typeof e.debug != "boolean") throw Error("dynamic-map-card debug must be a boolean.");
}
function l(e, t) {
	let n = {};
	for (let [t, r] of Object.entries(e)) a.has(t) || (n[t] = r);
	return n.type = "map", n.theme_mode = u(e, t), n;
}
function u(e, t) {
	return d(e, t) || (p(e.default_mode) ? e.default_mode : p(e.theme_mode) ? e.theme_mode : "auto");
}
function d(e, t) {
	var n;
	if (!e.mode_entity || !f(e.modes) || !t) return;
	let r = (n = t.states[e.mode_entity]) == null ? void 0 : n.state;
	if (!r || r === "unknown" || r === "unavailable") return;
	let i = e.modes[r];
	return p(i) ? i : void 0;
}
function f(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function p(e) {
	return typeof e == "string" && o.has(e);
}
function m(e, t, n) {
	var r;
	e.debug === !0 && console.debug("dynamic-map-card config", {
		mode_entity: e.mode_entity,
		mode_entity_state: e.mode_entity && n ? (r = n.states[e.mode_entity]) == null ? void 0 : r.state : void 0,
		resolved_theme_mode: t.theme_mode,
		native_map_config: t
	});
}
customElements.get("dynamic-map-card") || customElements.define("dynamic-map-card", s), console.info(`%cDYNAMIC-MAP-CARD%c ${i}`, "color: white; background: #2f7d6b; font-weight: 700; padding: 2px 4px; border-radius: 3px;", "color: #2f7d6b; font-weight: 700;");
//#endregion

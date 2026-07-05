//#region src/dynamic-map-card.ts
var e = "0.1.0", t = /* @__PURE__ */ new Set([
	"mode_entity",
	"modes",
	"default_mode"
]), n = /* @__PURE__ */ new Set([
	"light",
	"dark",
	"auto"
]), r = class extends HTMLElement {
	_config;
	_hass;
	_card;
	_lastThemeMode;
	_helpers;
	_loadPromise;
	setConfig(e) {
		i(e), this._config = e, this._lastThemeMode = void 0, this._ensureCard();
	}
	set hass(e) {
		if (this._hass = e, !this._config) return;
		let t = o(this._config, e);
		if (t !== this._lastThemeMode) {
			this._lastThemeMode = t, this._ensureCard();
			return;
		}
		this._card && (this._card.hass = e);
	}
	getCardSize() {
		return this._card?.getCardSize?.() ?? 3;
	}
	async _ensureCard() {
		this._loadPromise && await this._loadPromise, this._loadPromise = this._createOrUpdateCard(), await this._loadPromise, this._loadPromise = void 0;
	}
	async _createOrUpdateCard() {
		if (!this._config) return;
		let e = a(this._config, this._hass);
		if (!this._helpers) {
			if (!window.loadCardHelpers) throw Error("dynamic-map-card requires Home Assistant card helpers.");
			this._helpers = await window.loadCardHelpers();
		}
		let t = this._helpers.createCardElement(e);
		this._hass && (t.hass = this._hass), this.replaceChildren(t), this._card = t, this._lastThemeMode = e.theme_mode;
	}
};
function i(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("dynamic-map-card config must be an object.");
	if (e.mode_entity !== void 0 && typeof e.mode_entity != "string") throw Error("dynamic-map-card mode_entity must be a string.");
	if (e.modes !== void 0) {
		if (!c(e.modes)) throw Error("dynamic-map-card modes must be an object mapping entity states to light, dark, or auto.");
		for (let [t, n] of Object.entries(e.modes)) if (!l(n)) throw Error(`dynamic-map-card modes.${t} must be light, dark, or auto.`);
	}
	if (e.default_mode !== void 0 && !l(e.default_mode)) throw Error("dynamic-map-card default_mode must be light, dark, or auto.");
}
function a(e, n) {
	let r = {};
	for (let [n, i] of Object.entries(e)) t.has(n) || (r[n] = i);
	return r.type = "map", r.theme_mode = o(e, n), r;
}
function o(e, t) {
	return s(e, t) || (l(e.default_mode) ? e.default_mode : l(e.theme_mode) ? e.theme_mode : "auto");
}
function s(e, t) {
	if (!e.mode_entity || !c(e.modes) || !t) return;
	let n = t.states[e.mode_entity]?.state;
	if (!n || n === "unknown" || n === "unavailable") return;
	let r = e.modes[n];
	return l(r) ? r : void 0;
}
function c(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function l(e) {
	return typeof e == "string" && n.has(e);
}
customElements.define("dynamic-map-card", r), console.info(`%cDYNAMIC-MAP-CARD%c ${e}`, "color: white; background: #2f7d6b; font-weight: 700; padding: 2px 4px; border-radius: 3px;", "color: #2f7d6b; font-weight: 700;");
//#endregion

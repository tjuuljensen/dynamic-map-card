var m = Object.defineProperty;
var h = (e, r, t) => r in e ? m(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var a = (e, r, t) => h(e, typeof r != "symbol" ? r + "" : r, t);
const _ = "0.1.0", c = /* @__PURE__ */ new Set(["mode_entity", "modes", "default_mode"]), l = /* @__PURE__ */ new Set(["light", "dark", "auto"]);
class u extends HTMLElement {
  constructor() {
    super(...arguments);
    a(this, "_config");
    a(this, "_hass");
    a(this, "_card");
    a(this, "_lastThemeMode");
    a(this, "_helpers");
    a(this, "_loadPromise");
  }
  setConfig(t) {
    f(t), this._config = t, this._lastThemeMode = void 0, this._ensureCard();
  }
  set hass(t) {
    if (this._hass = t, !this._config)
      return;
    const o = d(this._config, t);
    if (o !== this._lastThemeMode) {
      this._lastThemeMode = o, this._ensureCard();
      return;
    }
    this._card && (this._card.hass = t);
  }
  getCardSize() {
    var t, o;
    return ((o = (t = this._card) == null ? void 0 : t.getCardSize) == null ? void 0 : o.call(t)) ?? 3;
  }
  async _ensureCard() {
    this._loadPromise && await this._loadPromise, this._loadPromise = this._createOrUpdateCard(), await this._loadPromise, this._loadPromise = void 0;
  }
  async _createOrUpdateCard() {
    if (!this._config)
      return;
    const t = p(this._config, this._hass);
    if (!this._helpers) {
      if (!window.loadCardHelpers)
        throw new Error("dynamic-map-card requires Home Assistant card helpers.");
      this._helpers = await window.loadCardHelpers();
    }
    const s = this._helpers.createCardElement(t);
    this._hass && (s.hass = this._hass), this.replaceChildren(s), this._card = s, this._lastThemeMode = t.theme_mode;
  }
}
function f(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    throw new Error("dynamic-map-card config must be an object.");
  if (e.mode_entity !== void 0 && typeof e.mode_entity != "string")
    throw new Error("dynamic-map-card mode_entity must be a string.");
  if (e.modes !== void 0) {
    if (!n(e.modes))
      throw new Error("dynamic-map-card modes must be an object mapping entity states to light, dark, or auto.");
    for (const [r, t] of Object.entries(e.modes))
      if (!i(t))
        throw new Error(`dynamic-map-card modes.${r} must be light, dark, or auto.`);
  }
  if (e.default_mode !== void 0 && !i(e.default_mode))
    throw new Error("dynamic-map-card default_mode must be light, dark, or auto.");
}
function p(e, r) {
  const t = {};
  for (const [o, s] of Object.entries(e))
    c.has(o) || (t[o] = s);
  return t.type = "map", t.theme_mode = d(e, r), t;
}
function d(e, r) {
  const t = y(e, r);
  return t || (i(e.default_mode) ? e.default_mode : i(e.theme_mode) ? e.theme_mode : "auto");
}
function y(e, r) {
  var s;
  if (!e.mode_entity || !n(e.modes) || !r)
    return;
  const t = (s = r.states[e.mode_entity]) == null ? void 0 : s.state;
  if (!t || t === "unknown" || t === "unavailable")
    return;
  const o = e.modes[t];
  return i(o) ? o : void 0;
}
function n(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function i(e) {
  return typeof e == "string" && l.has(e);
}
customElements.define("dynamic-map-card", u);
console.info(
  `%cDYNAMIC-MAP-CARD%c ${_}`,
  "color: white; background: #2f7d6b; font-weight: 700; padding: 2px 4px; border-radius: 3px;",
  "color: #2f7d6b; font-weight: 700;"
);

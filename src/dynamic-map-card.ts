type ThemeMode = "light" | "dark" | "auto";

type HassEntity = {
  state: string;
};

type HomeAssistant = {
  states: Record<string, HassEntity | undefined>;
};

type DynamicMapCardConfig = {
  type: string;
  mode_entity?: string;
  modes?: Record<string, unknown>;
  default_mode?: unknown;
  theme_mode?: unknown;
  [key: string]: unknown;
};

type LovelaceCard = HTMLElement & {
  setConfig?: (config: Record<string, unknown>) => void;
  hass?: HomeAssistant;
  getCardSize?: () => number | Promise<number>;
};

type LovelaceCardHelpers = {
  createCardElement: (config: Record<string, unknown>) => LovelaceCard;
};

export {};

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<LovelaceCardHelpers>;
  }
}

const CARD_VERSION = "0.1.0";
const CUSTOM_KEYS = new Set(["mode_entity", "modes", "default_mode"]);
const VALID_THEME_MODES = new Set<ThemeMode>(["light", "dark", "auto"]);

class DynamicMapCard extends HTMLElement {
  private _config?: DynamicMapCardConfig;
  private _hass?: HomeAssistant;
  private _card?: LovelaceCard;
  private _lastThemeMode?: ThemeMode;
  private _helpers?: LovelaceCardHelpers;
  private _loadPromise?: Promise<void>;

  setConfig(config: DynamicMapCardConfig): void {
    validateConfig(config);
    this._config = config;
    this._lastThemeMode = undefined;
    void this._ensureCard();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;

    if (!this._config) {
      return;
    }

    const themeMode = resolveThemeMode(this._config, hass);
    if (themeMode !== this._lastThemeMode) {
      this._lastThemeMode = themeMode;
      void this._ensureCard();
      return;
    }

    if (this._card) {
      this._card.hass = hass;
    }
  }

  getCardSize(): number | Promise<number> {
    return this._card?.getCardSize?.() ?? 3;
  }

  private async _ensureCard(): Promise<void> {
    if (this._loadPromise) {
      await this._loadPromise;
    }

    this._loadPromise = this._createOrUpdateCard();
    await this._loadPromise;
    this._loadPromise = undefined;
  }

  private async _createOrUpdateCard(): Promise<void> {
    if (!this._config) {
      return;
    }

    const mapConfig = buildMapConfig(this._config, this._hass);

    if (!this._helpers) {
      if (!window.loadCardHelpers) {
        throw new Error("dynamic-map-card requires Home Assistant card helpers.");
      }
      this._helpers = await window.loadCardHelpers();
    }

    const helpers = this._helpers;
    const card = helpers.createCardElement(mapConfig);
    if (this._hass) {
      card.hass = this._hass;
    }

    this.replaceChildren(card);
    this._card = card;
    this._lastThemeMode = mapConfig.theme_mode as ThemeMode;
  }
}

function validateConfig(config: DynamicMapCardConfig): void {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("dynamic-map-card config must be an object.");
  }

  if (config.mode_entity !== undefined && typeof config.mode_entity !== "string") {
    throw new Error("dynamic-map-card mode_entity must be a string.");
  }

  if (config.modes !== undefined) {
    if (!isPlainObject(config.modes)) {
      throw new Error("dynamic-map-card modes must be an object mapping entity states to light, dark, or auto.");
    }

    for (const [state, mode] of Object.entries(config.modes)) {
      if (!isThemeMode(mode)) {
        throw new Error(`dynamic-map-card modes.${state} must be light, dark, or auto.`);
      }
    }
  }

  if (config.default_mode !== undefined && !isThemeMode(config.default_mode)) {
    throw new Error("dynamic-map-card default_mode must be light, dark, or auto.");
  }
}

function buildMapConfig(config: DynamicMapCardConfig, hass?: HomeAssistant): Record<string, unknown> {
  const mapConfig: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(config)) {
    if (!CUSTOM_KEYS.has(key)) {
      mapConfig[key] = value;
    }
  }

  mapConfig.type = "map";
  mapConfig.theme_mode = resolveThemeMode(config, hass);

  return mapConfig;
}

function resolveThemeMode(config: DynamicMapCardConfig, hass?: HomeAssistant): ThemeMode {
  const dynamicMode = resolveDynamicThemeMode(config, hass);
  if (dynamicMode) {
    return dynamicMode;
  }

  if (isThemeMode(config.default_mode)) {
    return config.default_mode;
  }

  if (isThemeMode(config.theme_mode)) {
    return config.theme_mode;
  }

  return "auto";
}

function resolveDynamicThemeMode(config: DynamicMapCardConfig, hass?: HomeAssistant): ThemeMode | undefined {
  if (!config.mode_entity || !isPlainObject(config.modes) || !hass) {
    return undefined;
  }

  const state = hass.states[config.mode_entity]?.state;
  if (!state || state === "unknown" || state === "unavailable") {
    return undefined;
  }

  const mappedMode = config.modes[state];
  return isThemeMode(mappedMode) ? mappedMode : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && VALID_THEME_MODES.has(value as ThemeMode);
}

customElements.define("dynamic-map-card", DynamicMapCard);

console.info(
  `%cDYNAMIC-MAP-CARD%c ${CARD_VERSION}`,
  "color: white; background: #2f7d6b; font-weight: 700; padding: 2px 4px; border-radius: 3px;",
  "color: #2f7d6b; font-weight: 700;",
);

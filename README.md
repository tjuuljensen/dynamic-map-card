# Dynamic Map Card

`dynamic-map-card` is a Home Assistant Lovelace frontend card that renders the native map card and dynamically sets the native map theme from a configured entity state.

It exists for dashboards where the map should follow something more specific than the global Home Assistant theme, such as using a light map while `sun.sun` is `above_horizon` and a dark map while it is `below_horizon`.

![Dynamic Map Card preview](docs/images/logo.png)

## Installation

### HACS

1. Add this repository as a HACS custom repository.
2. Set the category to `Lovelace`.
3. Install `Dynamic Map Card`.
4. Add the resource if HACS does not add it automatically:

```yaml
url: /hacsfiles/dynamic-map-card/dynamic-map-card.js
type: module
```

### Manual

1. Copy `dynamic-map-card.js` to `/config/www/community/dynamic-map-card/dynamic-map-card.js`.
2. Add this Lovelace resource:

```yaml
url: /local/community/dynamic-map-card/dynamic-map-card.js
type: module
```

## Basic Sun Example

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
mode_entity: sun.sun
modes:
  above_horizon: light
  below_horizon: dark
default_mode: auto
```

## Boolean Example

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
mode_entity: input_boolean.map_dark_mode
modes:
  "on": dark
  "off": light
default_mode: auto
```

## Binary Sensor Example

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
mode_entity: binary_sensor.map_should_use_dark_theme
modes:
  "on": dark
  "off": light
default_mode: auto
```

## Native Map-Card Options

Use the same flat YAML shape as Home Assistant's native map card.

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
  - zone.home
hours_to_show: 24
default_zoom: 14
aspect_ratio: "16:9"
auto_fit: true
geo_location_sources:
  - gdacs
mode_entity: sun.sun
modes:
  above_horizon: light
  below_horizon: dark
default_mode: auto
```

Native map-card options such as `entities`, `hours_to_show`, `default_zoom`, `aspect_ratio`, `auto_fit`, `geo_location_sources`, and `dark_mode` are passed through to the native map card. The wrapper sets `type: map` internally. For compatibility with older Home Assistant frontend versions, dynamic `light` and `dark` modes are applied through the native `dark_mode` option; `auto` leaves the native map card to follow the active Home Assistant theme.

## Dynamic Options

`mode_entity` is the entity whose state controls the map theme mode. It can be any Home Assistant entity with a string state, such as `sun.sun`, an `input_boolean`, a `binary_sensor`, an `input_select`, or a regular sensor.

`modes` maps entity states to map theme mode values. Supported output values are:

- `light`
- `dark`
- `auto`

Example:

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
mode_entity: input_select.map_theme
modes:
  Day: light
  Night: dark
  Auto: auto
```

## Fallback Behavior

The card resolves `theme_mode` in this order:

1. A valid dynamic mode from `mode_entity` and `modes`.
2. `default_mode`, when explicitly configured.
3. User-provided `theme_mode`, when valid.
4. `auto`.

Fallback is used when `mode_entity` is missing, unavailable, unknown, the current state is not found in `modes`, or the mapped mode is invalid.

Example:

```yaml
type: custom:dynamic-map-card
entities:
  - person.torsten
theme_mode: light
mode_entity: sun.sun
modes:
  below_horizon: dark
```

When `sun.sun` is `below_horizon`, the map uses `dark`. For any other state, the map falls back to the configured `theme_mode: light`.

## Validation

Invalid configuration is shown as a Lovelace card error. The card validates that:

- `mode_entity`, when supplied, is a string.
- `modes`, when supplied, is an object.
- All mapped mode values are `light`, `dark`, or `auto`.
- `default_mode`, when supplied, is `light`, `dark`, or `auto`.

## Compatibility Notes

The card creates Home Assistant's native `hui-map-card` through Lovelace card helpers and passes native map-card options through unchanged. Compatibility with specific native map-card options still depends on the Home Assistant frontend version installed in your Home Assistant instance.

If the resolved mode is `auto`, the native map card and the active Home Assistant theme decide the final map appearance.

## Release Model

Published HACS versions should use tagged GitHub releases. The release workflow builds `dynamic-map-card.js` and uploads that file as a release asset for tags named `vX.Y.Z`.

Release checklist:

1. Bump `package.json` version and `CARD_VERSION` in `src/dynamic-map-card.ts`.
2. Run `npm ci`, `npm run typecheck`, and `npm run build`.
3. Commit the source and rebuilt `dynamic-map-card.js`.
4. Create and push a tag such as `v0.1.1`.
5. Confirm the GitHub release contains `dynamic-map-card.js`.

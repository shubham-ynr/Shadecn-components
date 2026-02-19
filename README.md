# Component Registry

A custom [shadcn/ui registry](https://ui.shadcn.com/docs/registry) for distributing reusable components.

## Installation

### Option A: Short Command (Recommended)

1. Add this registry config to your project's `components.json`:

```json
{
  "registries": {
    // Uses specific commit hash to bypass caching issues immediately
    "@component": "https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@c8f7ff7/public/r/{name}.json"
  }
}
```

2. Run the installation command:

```bash
npx shadcn@latest add @component/data-table
npx shadcn@latest add @component/form-input
npx shadcn@latest add @component/form-textarea
```

### Option B: Zero Config (Full URL)

If you don't want to edit `components.json`, use these full commands:

```bash
# Data Table
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@c8f7ff7/public/r/data-table.json

# Form Input
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@c8f7ff7/public/r/form-input.json

# Form Textarea
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@c8f7ff7/public/r/form-textarea.json
```

## Development

### Setup

```bash
npm install
```

### Adding a New Component

1. Create component files under `registry/new-york/blocks/<component-name>/`
2. Add an entry to `registry.json`.
3. Build the registry:

```bash
npm run registry:build
```

### Project Structure (registry template)

```
registry/
  └── new-york/
      └── blocks/
          ├── data-table/
          │   ├── data-table.jsx
          │   └── data-table.css
          ├── form-input/
          │   └── form-input.jsx
          └── form-textarea/
              └── form-textarea.jsx
registry.json          ← Source manifest
public/r/              ← Generated output (by shadcn build)
```

## License

MIT

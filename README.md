# Component Registry

A custom [shadcn/ui registry](https://ui.shadcn.com/docs/registry) for distributing reusable components.

## Components

| Component         | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **data-table**    | Dynamic, server-side paginated data table with search, sorting, selection, and loading states    |
| **form-input**    | Enhanced input with label, icon support, password toggle, number restrictions, and error display |
| **form-textarea** | Enhanced textarea with label, icon support, and error display                                    |

## Quick Setup (Recommended)

1. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@component": "https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@main/public/r/{name}.json"
  }
}
```

> **Note:** If you encounter errors due to caching (e.g., changes not reflecting immediately), use the latest commit hash instead of `@main`:
> `"@component": "https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@c8f7ff7/public/r/{name}.json"`

2. Install components easily:

```bash
npx shadcn@latest add @component/data-table
npx shadcn@latest add @component/form-input
npx shadcn@latest add @component/form-textarea
```

---

## Manual Installation

If you prefer confusing one-off commands:

```bash
npx shadcn@latest add @component/data-table
npx shadcn@latest add @component/form-input
npx shadcn@latest add @component/form-textarea
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

# Component Registry

A custom [shadcn/ui registry](https://ui.shadcn.com/docs/registry) for distributing reusable components.

## Components

| Component         | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| **data-table**    | Dynamic, server-side paginated data table with search, sorting, selection, and loading states    |
| **form-input**    | Enhanced input with label, icon support, password toggle, number restrictions, and error display |
| **form-textarea** | Enhanced textarea with label, icon support, and error display                                    |

## Installation

Install any component in your shadcn-based project:

```bash
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@main/public/r/data-table.json
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@main/public/r/form-input.json
npx shadcn@latest add https://cdn.jsdelivr.net/gh/shubham-ynr/Shadecn-components@main/public/r/form-textarea.json
```

## Development

### Setup

```bash
npm install
```

### Adding a New Component

1. Create component files under `registry/new-york/blocks/<component-name>/`
2. Add an entry to `registry.json`:

```json
{
  "name": "my-component",
  "type": "registry:component",
  "title": "My Component",
  "description": "What it does.",
  "dependencies": ["npm-packages"],
  "registryDependencies": ["button", "card"],
  "files": [
    {
      "path": "registry/new-york/blocks/my-component/my-component.jsx",
      "type": "registry:component"
    }
  ]
}
```

3. Build the registry:

```bash
npm run registry:build
```

### Project Structure

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

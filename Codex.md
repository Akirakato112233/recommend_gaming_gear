# Codex Working Rules

Read this file before starting any work in this repository.

## Next.js

Before any Next.js work, find and read the relevant documentation in:

```text
node_modules/next/dist/docs/
```

Treat those docs as the source of truth. Next.js may have breaking changes, and training data can be outdated.

## Code Quality

Write clean, good code that is easy to read and easy to change.

- Prefer simple, explicit code over clever code.
- Use clear names for files, functions, variables, and types.
- Keep changes focused on the task.
- Follow the existing project structure and style.
- Avoid unnecessary abstraction.
- Handle errors clearly.
- Keep secrets out of source control.

## Testing

Always test after making changes.

Use the smallest useful validation for the change:

- Run lint when editing source code.
- Run build when changing Next.js behavior, config, routes, or types.
- Run Prisma validation or migrations checks when changing database schema.
- Test Docker Compose config when changing Docker files.
- Manually verify important user-facing flows when UI changes.

If a test cannot be run, explain why and mention the remaining risk.

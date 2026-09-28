# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Project conventions

- Group feature files by responsibility: components, screens, hooks, utils, types, mocks, constants, and styles. Do not add empty directories or unused abstractions.
- Use PascalCase filenames for components and screens; camelCase for other source files. Keep platform suffixes such as `.web.tsx`.
- Use named exports and descriptive identifiers (`styles`, not `s`).
- Separate logical blocks with blank lines, especially before and after conditionals, loops, try/catch blocks, and returns. No extra blank line is needed at a block boundary. Always use braces for conditionals.
- Keep reusable UI values and user-facing text in named constants; separate rendering from side effects and platform APIs.
- Preserve native photo-source menus. Do not replace them with a custom bottom sheet.

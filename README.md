# bun-intervals

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

or with hot updates on changes.

```bash
bun dev
```

To run tests run

```bash
bun test
```

To build

```bash
bun run build
```

You can test the api by posting at:
https://range.borgund.dev/intervals

Use body parameters in the post request

```json
{
  "includes": ["200-300", "10-100", "400-500"],
  "excludes": ["410-420", "95-205", "100-150"]
}
```

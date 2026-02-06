# Super-Favorite Docker Profile

This profile builds and runs your current Misskey fork (including Super-Favorite changes) with PostgreSQL and Redis.

## Start

```bash
docker compose -f compose.superfavorite.yml up -d --build
```

Open:

- http://localhost:3000

## Logs

```bash
docker compose -f compose.superfavorite.yml logs -f web
```

## Stop

```bash
docker compose -f compose.superfavorite.yml down
```

To also remove persisted volumes:

```bash
docker compose -f compose.superfavorite.yml down -v
```

## Verify Super-Favorite UI

1. Create/login account.
2. Open any note.
3. Confirm sparkle button appears in note footer.
4. Toggle button and confirm active color changes.

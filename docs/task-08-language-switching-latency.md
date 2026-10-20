# Task 08: EN/DE Language-Switching Latency

## Result

This is a measurement-only outcome. The current loaders wait for both the requested locale and its counterpart, but the observed response times do not show a stable, large delay attributable to the counterpart or settings request. Replacing either request would make language availability or server-rendered SEO alternates incomplete until a later client request. The API exposes no separate availability-only endpoint, so the evidence does not support that tradeoff.

The branch is based on `master` at `8b81fdede8b96ee26e6bd1ae5090393a4d6c756e`. GitHub's remote `master` ref was verified at that SHA; `git fetch` itself was unavailable in this environment because the configured SSH transport failed. No backend files were changed.

## Request path

`loadLocalizedContent()` and `loadLocalizedProject()` in `src/lib/api.js` fetch the requested locale and the other locale concurrently with `Promise.all`. The route loader returns only after both complete. On standalone project routes, the counterpart call requests the same project endpoint and downloads the full article just to establish whether that translation exists. The project list counterpart supplies the other locale's slugs.

The root layout separately fetches localized `/settings`. It runs as a route load alongside page data; a temporary timing hook showed 71–168 ms for the browser samples below. API requests use neutral paths with `?locale=en` or `?locale=de`.

The project panel already loads its article independently from availability: `loadProjectWithAvailability()` opens the panel after article content is ready, then applies confirmed locale availability when it arrives. This investigation did not change the panel or its navigation.

The installed SvelteKit version is `1.0.0-next.516`. Its loader implementation awaits promises nested in returned data, so returning the counterpart promise from a loader would still block navigation.

## API measurements

Read-only GET requests were sent to `https://api.armin.ba`. The response sizes below are downloaded body sizes. These are individual samples, not latency guarantees.

| Endpoint | EN status / bytes / ms | DE status / bytes / ms |
| --- | ---: | ---: |
| `/home` | 200 / 1,170 / 234 | 200 / 1,377 / 153 |
| `/settings` | 200 / 1,806 / 110 | 200 / 1,915 / 127 |
| `/about` | 200 / 7,070 / 143 | 200 / 7,847 / 168 |
| `/projects` | 200 / 7,912 / 134 | 200 / 7,920 / 160 |
| `/projects/multi-effects-guitar-pedal` | 200 / 10,089 / 228 | 200 / 10,880 / 197 |
| `/projects/mimo-website` | 200 / 13,264 / 196 | 200 / 13,474 / 208 |

Repeated GET and HEAD requests for the pedal detail route took about 195–203 ms and 196–198 ms respectively. HEAD avoided transferring roughly 10–11 KB, but did not reduce request latency in these samples. For `/projects`, the production EN and DE lists contained the same seven slugs, so no published project lacked a translation in this dataset.

The page loaders issue the requested and counterpart requests in parallel. A slower counterpart can therefore gate a transition when it finishes last, but the API samples show similar times for most locale pairs. Temporary server logging also produced variable request timings and did not include a navigation correlation ID. The in-app browser did not expose a network waterfall, so request logs cannot reliably assign each individual request to a specific click.

## Browser measurements

The local frontend was served at `http://127.0.0.1:5173` with `PUBLIC_API_BASE_URL=https://api.armin.ba`. These are warm in-app language-switch clicks measured from the switcher's `goto()` start until its promise resolved. Temporary timing hooks were removed after collecting the data.

| Route | EN → DE | DE → EN | Settings call observed |
| --- | ---: | ---: | ---: |
| Home | 223 ms | 173 ms | 73–168 ms |
| Projects list | 190 ms | 253 ms | 87 ms |
| About | 351 ms | 390 ms | 92–96 ms |
| Standalone pedal detail | 544 ms | 589 ms | 71–104 ms |

Single cold direct loads took 873 ms for Home, 793 ms for About, and 906 ms for the EN pedal detail route. Cold load includes the full page boot and is not directly comparable with the in-app switch timings. The detail route was also opened directly and refreshed in both EN and DE; both rendered the full article.

These measurements show that the detail route is slowest, while the settings request is usually a smaller part of the transition. Browser timings vary by route and direction, and one short Home transition was close to the observed settings time. Without a network waterfall tied to each click, the data does not establish one request as a consistent cause.

## Behavior checks

- Switched EN → DE → EN on Home, Projects, About, and the available pedal detail route. Localized titles and page content updated, and the language links pointed to the matching route.
- Confirmed that the production API currently publishes both locales for all seven listed projects. A separate configured staging API returned 404 for German Home and About; the German switch was disabled on the affected page. Existing tests also cover unpublished project translations and unknown availability.
- Opened and closed a project panel, used browser Back to return to the list, and Forward to reopen the detail. Two rapid project clicks ended with the most recently selected Digital Guitar Effects Processor article in the panel.
- The panel's History API, request-race handling, cache, `LazyLoadingWrapper` LQIP markup, and smooth opening code were left unchanged. The existing `tests/i18n.test.js` includes coverage for opening article content before counterpart availability resolves and for blur markup. The browser accessibility snapshot captures the loaded panel, not intermediate animation frames, so it did not independently time the blur transition.

## Why no runtime change was made

Removing counterpart work from the route loader would defer confirmed availability. The switcher would need to stay disabled while availability is unknown, and server-rendered hreflang metadata would omit known alternates until client JavaScript updated it. Keeping the current server requests preserves accurate switcher state and SEO alternates on first render. Using HEAD for detail availability reduced bytes but did not reduce observed latency. The measurements do not justify introducing a cache, new API contract, or delayed metadata update.

No code change was made, so a valid before/after timing comparison could not be collected. The table above is the baseline; presenting another run of unchanged code as an “after” would not measure an optimization.

## Verification

- `npm test`: passed, 19 tests.
- `npm run build`: passed. The first sandboxed attempt hit a Windows permission error while creating ignored `.svelte-kit` output; the build then completed with workspace write access. Vite reported the existing deprecated `polyfillModulePreload` option and an outdated `caniuse-lite` database. `adapter-auto` completed and noted that no production platform was detected.

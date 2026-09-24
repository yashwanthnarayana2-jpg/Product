# Product Admin Dashboard

Next.js + React + Tailwind CSS + Axios assignment using DummyJSON.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Demo credentials:
- Username: `emilys`
- Password: `emilyspass`

## Architecture

- `api/axios.js`: one shared Axios instance, token interceptor and centralized 401 handling.
- `api/authApi.js`: authentication API calls.
- `api/productApi.js`: all product API calls.
- `components/`: small reusable UI components.
- `hooks/useDebounce.js`: debounced search.
- URL query parameters hold page, limit, search, category and sort.

## Search race condition

Search requests use `AbortController`. When the search/page/filter changes, the previous request is cancelled so a slow old response cannot replace the current result.

## Search + category

DummyJSON's API does not provide a combined search-and-category endpoint. This app gives search priority and clears the category when a search is entered. When category is selected, the normal category endpoint is used.

## Add/Edit/Delete persistence

DummyJSON simulates POST/PUT/DELETE operations; changes are not permanently stored on the server. The list updates immediately in the browser for the current session where applicable. A production app would persist changes in its own backend/database.

## Invalid URL values

Invalid or missing page/limit values fall back to safe defaults. Pages beyond the available range are clamped to the last available page.

## Double-submit protection

Login and product forms disable their submit action while a request is in progress.

## Note

The API is external and may change behavior. The UI intentionally handles loading, empty and error states.

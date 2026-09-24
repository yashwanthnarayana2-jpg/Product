 # Product Admin Dashboard

A responsive product management admin dashboard built with **Next.js, React, Tailwind CSS, and Axios**, using the free **DummyJSON API**.

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Axios
* DummyJSON API
* JavaScript

## Features

### Authentication

* Login using DummyJSON authentication API
* Demo credentials:

  * Username: `emilys`
  * Password: `emilyspass`
* Login error handling
* Protected product pages
* Logout functionality
* Axios automatically adds the authentication token to requests

### Product Management

* Product list with:

  * Image
  * Title
  * Category
  * Price
  * Rating
  * Stock
* Desktop table view
* Mobile card view
* Product details page
* Add product
* Edit product
* Delete product with confirmation

### Pagination

* API-based pagination using `limit` and `skip`
* Page numbers
* Previous/Next buttons
* Page size options:

  * 10
  * 20
  * 50
* Displays information such as:

```text
Showing 21–40 of 194
```

### Search

* Product search using:

```text
/products/search?q=
```

* Debounced search to prevent unnecessary API calls
* Automatically returns to page 1 when search changes
* Previous search requests are cancelled to prevent stale results from replacing newer results

### Filter and Sort

* Filter products by category
* Sort by:

  * Price low to high
  * Price high to low
  * Rating
  * Title

### URL State

The following values are stored in the URL:

```text
page
limit
search
category
sort
```

Example:

```text
/products?page=2&limit=20&search=phone&sort=price-asc
```

This means the same state is restored when the page is refreshed or the URL is shared.

## API

Base URL:

```text
https://dummyjson.com
```

Main endpoints:

```text
POST   /auth/login

GET    /products
GET    /products/search?q=
GET    /products/categories
GET    /products/category/{category}
GET    /products/{id}

POST   /products/add
PUT    /products/{id}
DELETE /products/{id}
```

## Project Structure

```text
product-admin/
│
├── app/
│   ├── login/
│   │   └── page.jsx
│   ├── products/
│   │   ├── page.jsx
│   │   ├── new/
│   │   │   └── page.jsx
│   │   └── [id]/
│   │       ├── page.jsx
│   │       └── edit/
│   │           └── page.jsx
│   ├── layout.jsx
│   └── page.jsx
│
├── api/
│   ├── axios.js
│   ├── authApi.js
│   └── productApi.js
│
├── components/
│   ├── ProductTable.jsx
│   ├── ProductForm.jsx
│   ├── Pagination.jsx
│   ├── Loader.jsx
│   └── ErrorMessage.jsx
│
├── hooks/
│   └── useDebounce.js
│
├── utils/
│   └── auth.js
│
├── app/globals.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Axios Architecture

The project uses one shared Axios instance:

```text
api/axios.js
```

The Axios request interceptor reads the login token from `localStorage` and adds it to requests.

```text
Login
  ↓
Token stored in localStorage
  ↓
Axios interceptor
  ↓
Authorization header
  ↓
DummyJSON API
```

The response interceptor handles authentication errors such as HTTP `401`.

## Search Race Condition

A user can type quickly:

```text
p
ph
pho
phon
phone
```

Without protection, an older request could finish after the newer request and overwrite the latest result.

The application uses `AbortController` to cancel the previous request when the search/page/filter changes.

Therefore:

```text
Old request → Cancelled
New request → Active
```

This prevents stale search results from replacing newer results.

## Search and Category Filter Decision

DummyJSON does not provide a combined API endpoint for searching and filtering by category.

Therefore, the application uses the following approach:

```text
Search entered
    ↓
Search API is used
    ↓
Category is cleared
```

When a category is selected without search:

```text
Category selected
    ↓
Category API is used
```

This keeps the API behavior predictable.

## Add, Edit and Delete Behavior

DummyJSON provides simulated POST, PUT and DELETE operations. These operations do not permanently modify the server database.

The application therefore updates the UI after successful operations so the user can immediately see the change.

For a production application, these operations would normally be persisted in a backend database.

## Invalid URL Values

The application safely handles incorrect query parameters.

Example:

```text
?page=abc
```

falls back to:

```text
page = 1
```

Similarly, unsup

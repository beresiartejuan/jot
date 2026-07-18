# Jot API Documentation

Base URL: `/api`

Health check: `GET /health`

---

## Authentication

The API uses an **access token** + **refresh token** flow.

- **Access token**: short-lived JWT (15 minutes). Send it in every authenticated request:

  ```
  Authorization: Bearer <access_token>
  ```

- **Refresh token**: long-lived JWT (72 hours). Stored automatically in an `httpOnly`, `Secure`, `SameSite=Strict` cookie named `refresh_token`. The browser sends it to `/api/users/refresh`.

- **Token refresh**: when the access token expires, call `POST /api/users/refresh`. You get a new access token. If the refresh token has 10 hours or less of remaining life, a new refresh token is issued in the cookie and the previous one becomes invalid.

- **Logout everywhere**: `POST /api/users/logout-all` invalidates all refresh tokens by rotating the user's `refresh_token_key`.

This header is required for all `/api/notes` routes and `/api/users/logout-all`.

---

## Users

### `POST /api/users/register`

Create a new user account.

**Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response `201 Created`:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "accessToken": "<jwt>",
  "expiresIn": 900
}
```

A `refresh_token` cookie is also set (`httpOnly`, `Secure`, `SameSite=Strict`).

**Errors:** `400 Bad Request`, `409 Conflict`

---

### `POST /api/users/login`

Authenticate a user.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response `200 OK`:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "accessToken": "<jwt>",
  "expiresIn": 900
}
```

A `refresh_token` cookie is also set.

**Errors:** `400 Bad Request`, `401 Unauthorized`

---

### `POST /api/users/refresh`

Issue a new access token using the `refresh_token` cookie.

**Cookie:**

```
refresh_token=<refresh_jwt>; Path=/api/users; HttpOnly; Secure; SameSite=Strict
```

**Response `200 OK`:**

```json
{
  "accessToken": "<new_jwt>",
  "expiresIn": 900
}
```

If the refresh token has 10 hours or less remaining, a new `refresh_token` cookie is set with a fresh token.

**Errors:** `401 Unauthorized`

---

### `POST /api/users/logout`

Clear the refresh token cookie. The access token is still valid until it expires.

**Response `200 OK`:**

```json
{
  "message": "Logged out"
}
```

---

### `POST /api/users/logout-all`

Invalidate all refresh tokens for the authenticated user and clear the current refresh cookie.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

```json
{
  "message": "All sessions logged out",
  "user": { ... }
}
```

**Errors:** `401 Unauthorized`, `404 Not Found`

---

## Notes

### `POST /api/notes`

Create a new note for the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "title": "My note",
  "content": "Note content",
  "isPublic": false,
  "tagNames": ["work", "ideas"]
}
```

**Response `201 Created`:**

Returns the created note with its tags.

**Errors:** `400 Bad Request`, `401 Unauthorized`

---

### `GET /api/notes`

List all notes for the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns an array of notes with tags.

**Errors:** `401 Unauthorized`

---

### `GET /api/notes/:id`

Get a single note by ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns the note with tags if the user owns it or if it is public.

**Errors:** `401 Unauthorized`, `404 Not Found`

---

### `PATCH /api/notes/:id`

Update a note owned by the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "isPublic": true,
  "tagNames": ["work"]
}
```

**Response `200 OK`:**

Returns the updated note with tags.

**Errors:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

---

### `DELETE /api/notes/:id`

Delete a note owned by the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns the deleted note with tags.

**Errors:** `401 Unauthorized`, `404 Not Found`

---

## Error Response Format

All errors follow this shape:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

Common codes:

- `VALIDATION_ERROR` — `400`
- `UNAUTHORIZED` — `401`
- `NOT_FOUND` — `404`
- `CONFLICT` — `409`

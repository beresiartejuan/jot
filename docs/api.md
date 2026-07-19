# Jot API Documentation

Base URL: `/api`

Health check: `GET /health`

---

## Authentication

The API uses an **access token** + **refresh token** flow.

- **Access token**: short-lived JWT (15 minutes). Send it in authenticated requests:

  ```
  Authorization: Bearer <access_token>
  ```

- **Refresh token**: long-lived JWT (72 hours). Stored automatically in an `httpOnly`, `Secure`, `SameSite=Strict` cookie named `refresh_token` with `Path=/api/users` and `Max-Age=72h` (259200 seconds). The browser sends it automatically on every request to `/api/users/*`; the frontend does not need to read or send it manually.

- **Token refresh**: when the access token expires, call `POST /api/users/refresh` without a body. You get a new access token. If the refresh token has 10 hours or less of remaining life, a new refresh token is issued in the cookie and the previous one becomes invalid.

- **Logout**: `POST /api/users/logout` clears the refresh cookie. The current access token remains valid until it expires.

- **Logout everywhere**: `POST /api/users/logout-all` requires authentication. It invalidates all refresh tokens by rotating the user's `refresh_token_key`, and clears the current refresh cookie.

### Access token payload

```json
{
  "sub": "<user-id>",
  "email": "user@example.com",
  "username": "johndoe"
}
```

---

## Common response shapes

### User

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Note with tags (`NoteWithTags`)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "My note",
  "content": "Note content",
  "isPublic": false,
  "createdAt": "...",
  "updatedAt": "...",
  "tags": [
    {
      "id": "uuid",
      "userId": "uuid",
      "name": "work",
      "color": null,
      "createdAt": "..."
    }
  ]
}
```

### Error response

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

A `refresh_token` cookie is also set (`httpOnly`, `Secure`, `SameSite=Strict`, `Path=/api/users`, `Max-Age=72h`).

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

Issue a new access token using the `refresh_token` cookie sent automatically by the browser.

**Request body:** none.

**Cookie:**

```
refresh_token=<refresh_jwt>; Path=/api/users; HttpOnly; Secure; SameSite=Strict; Max-Age=259200
```

**Response `200 OK`:**

```json
{
  "accessToken": "<new_jwt>",
  "expiresIn": 900
}
```

If the refresh token has 10 hours or less remaining, a new `refresh_token` cookie is set with a fresh token. Any previous refresh cookie becomes invalid.

**Errors:** `401 Unauthorized`

---

### `POST /api/users/logout`

Clear the refresh token cookie. No authentication required.

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

**Errors:** `401 Unauthorized`, `404 Not Found` (only returned if the authenticated user no longer exists in the database)

---

## Notes

Notes are returned newest-first by `updatedAt`.

Tag names passed in `tagNames` are trimmed, lowercased, and deduplicated. New tags are created automatically on first use.

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

- `title` and `content` are required.
- `isPublic` is optional and defaults to `false`.
- `tagNames` is optional and defaults to an empty array.

**Response `201 Created`:**

Returns the created note with tags (`NoteWithTags`).

**Errors:** `400 Bad Request`, `401 Unauthorized`

---

### `GET /api/notes`

List all notes for the authenticated user, ordered by `updatedAt` descending.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns an array of `NoteWithTags`.

**Errors:** `401 Unauthorized`

---

### `GET /api/notes/:id`

Get a single note by ID. Authentication is optional. A public note can be read without an access token. A private note can only be read by its owner.

**Headers (optional):**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns the `NoteWithTags` if the note is public or belongs to the authenticated user.

**Errors:** `401 Unauthorized`, `404 Not Found`

---

### `PATCH /api/notes/:id`

Update a note owned by the authenticated user. All fields are optional; missing fields are left unchanged.

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

- If `tagNames` is provided, it **replaces** the full tag set for the note.

**Response `200 OK`:**

Returns the updated `NoteWithTags`.

**Errors:** `400 Bad Request`, `401 Unauthorized`, `404 Not Found`

---

### `DELETE /api/notes/:id`

Delete a note owned by the authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response `200 OK`:**

Returns the deleted `NoteWithTags`.

**Errors:** `401 Unauthorized`, `404 Not Found`

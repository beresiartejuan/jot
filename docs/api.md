# Jot API Documentation

Base URL: `/api`

Health check: `GET /health`

---

## Authentication

For now, authentication is simulated by sending the user ID in a header:

```
x-user-id: <user-id>
```

This header is required for all `/api/notes` routes.

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
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "...",
  "updatedAt": "..."
}
```

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
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors:** `400 Bad Request`, `401 Unauthorized`

---

## Notes

### `POST /api/notes`

Create a new note for the authenticated user.

**Headers:**

```
x-user-id: <user-id>
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
x-user-id: <user-id>
```

**Response `200 OK`:**

Returns an array of notes with tags.

---

### `GET /api/notes/:id`

Get a single note by ID.

**Headers:**

```
x-user-id: <user-id>
```

**Response `200 OK`:**

Returns the note with tags if the user owns it or if it is public.

**Errors:** `401 Unauthorized`, `404 Not Found`

---

### `PATCH /api/notes/:id`

Update a note owned by the authenticated user.

**Headers:**

```
x-user-id: <user-id>
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
x-user-id: <user-id>
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

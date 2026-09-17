# MeetAndJam API Contract

## General

- **Base URL:** `http://localhost:3000`
- **Auth:** Bearer JWT in `Authorization: Bearer <token>` header
- **Content-Type:** `application/json`
- **OpenAPI schema:** `http://localhost:3000/documentation/json`

## Endpoints

| Method | Path                             | Auth  | Request                       | Response               |
| ------ | -------------------------------- | ----- | ----------------------------- | ---------------------- |
| POST   | `/auth/register`                 | no    | `{ email, password, name }`   | 201 `{ token, user }`  |
| POST   | `/auth/login`                    | no    | `{ email, password }`         | 200 `{ token, user }`  |
| GET    | `/auth/me`                       | yes   | —                             | 200 `User`             |
| POST   | `/events/`                       | yes   | `EventInput`                  | 201 `Event`            |
| GET    | `/events/`                       | no    | `?page&limit&search&category` | 200 `Paginated<Event>` |
| GET    | `/events/me`                     | yes   | `?page&limit&search&category` | 200 `Paginated<Event>` |
| GET    | `/events/joined`                 | yes   | —                             | 200 `Event[]` ⚠️       |
| GET    | `/events/user/{userId}`          | yes   | `?page&limit&search&category` | 200 `Paginated<Event>` |
| GET    | `/events/{eventId}`              | no    | —                             | 200 `Event`            |
| PATCH  | `/events/{eventId}`              | yes   | `Partial<EventInput>`         | 200 `Event`            |
| DELETE | `/events/{eventId}`              | yes   | —                             | 200 `{ message }`      |
| POST   | `/events/join`                   | yes   | `{ eventId }`                 | 201 `EventParticipant` |
| POST   | `/events/leave`                  | yes   | `{ eventId }`                 | 200 `{ message }`      |
| GET    | `/events/{eventId}/participants` | no    | —                             | 200 `Participant[]`    |
| DELETE | `/events/all`                    | admin | —                             | 200 `{ message }`      |

`GET /events/joined` — no pagination. MVP debt.

## Types

### User (auth)

```ts
{
  id: string;
  email: string;
  name: string;
}
```

### User (me)

```ts
{
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### AuthResponse

```ts
{
  token: string;
  user: User;
}
```

### Event

```ts
{
  id: string;
  title: string;
  description: string;
  maxParticipants: number | null;
  contactInfo: string | null;
  entryPrice: number | null;
  isDonationBased: boolean;
  donationInfo: string | null;
  address: string;
  startsAt: string;
  category: EventCategory | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

### EventInput (create)

```ts
{
  title: string;
  description: string;
  address: string;
  startsAt: string;
  category: EventCategory;
  maxParticipants?: number;
  contactInfo?: string;
  entryPrice?: number;
  isDonationBased?: boolean;
  donationInfo?: string;
}
```

### EventCategory

```ts
"jam" | "word" | "theater" | "standup" | "dance" | "another"
```

### EventParticipant

```ts
{
  id: string;
  eventId: string;
  userId: string;
  joinedAt: string;
}
```

### Participant

```ts
{
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}
```

### Paginated<T>

```ts
{
  events: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### MessageResponse

```ts
{
  message: string;
}
```

## Pagination

**Query params:**

- `page` — page number (default 1)
- `limit` — page size (default 10, max 50)
- `search` — search by title/description/address
- `category` — filter by category

**Response shape:** `Paginated<Event>` — `{ events, total, page, limit, totalPages }`.

**URL state:** `/events?page=2&category=jam&search=jazz`

## Errors

**Unified format:**

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": null
}
```

### Error codes

| code                   | status | description               |
| ---------------------- | ------ | ------------------------- |
| `EMAIL_ALREADY_EXISTS` | 409    | Email is already taken    |
| `INVALID_CREDENTIALS`  | 401    | Invalid email or password |
| `USER_NOT_FOUND`       | 404    | User not found            |
| `EVENT_NOT_FOUND`      | 404    | Event not found           |
| `CATEGORY_NOT_FOUND`   | 404    | Category not found        |
| `FORBIDDEN`            | 403    | Access denied             |
| `ALREADY_JOINED`       | 409    | Already joined            |
| `NOT_JOINED`           | 409    | Not joined                |
| `UNAUTHORIZED`         | 401    | Unauthorized              |
| `VALIDATION_ERROR`     | 400    | Validation error          |
| `INVALID_JSON`         | 400    | Invalid JSON body         |
| `INTERNAL_ERROR`       | 500    | Internal server error     |

**Rule:** frontend makes decisions based on `code`, not `message`.

## Auth

- **Bearer JWT** in `Authorization: Bearer <token>`.
- Token is returned in the `token` field of `register`/`login` responses.
- Storage: `localStorage` (MVP).
- On 401 — logout and redirect to `/login`.

## MVP debts

1. `GET /events/joined` — no pagination. Add pagination when the volume grows.

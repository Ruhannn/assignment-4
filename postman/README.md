# Postman Collection — Car Rental API

## Import

1. Postman → Import → `postman/assignment-4.postman_collection.json`.
2. Set collection variable `baseUrl` (default `http://localhost:3000`).
3. Run **Auth → Login** once — its test script auto-saves `accessToken` into the collection variable, so every other request picks it up via `Authorization: Bearer {{accessToken}}`.

## Auth

Bearer token, not cookies. Header: `Authorization: Bearer <accessToken>`. Token comes from `POST /auth/login` or `POST /auth/register`.

Roles: `RENTER`, `OWNER`, `ADMIN` (set at register, `role` field, defaults to `RENTER`).

## Endpoints

| Method | Path | Auth | Body / Params |
|---|---|---|---|
| POST | `/auth/register` | none | `name, email, password, role?` |
| POST | `/auth/login` | none | `email, password` |
| GET | `/users/me` | any | — |
| GET | `/users` | ADMIN | — |
| GET | `/cars` | none | — |
| GET | `/cars/:id` | none | — |
| POST | `/cars` | OWNER | `brand, model, dailyRate, location` |
| PATCH | `/cars/:id` | OWNER, ADMIN | any subset of create fields + `isAvailable` |
| DELETE | `/cars/:id` | OWNER, ADMIN | — |
| POST | `/bookings` | RENTER | `carId, startDate, endDate` (ISO dates, `endDate > startDate`) |
| GET | `/bookings/my` | RENTER | — |
| GET | `/bookings` | ADMIN | — |
| POST | `/payments/checkout/:bookingId` | RENTER | — → returns Stripe `checkoutUrl` |
| GET | `/payments/my` | RENTER | — |
| POST | `/payments/webhook` | Stripe (signature-verified, no bearer) | raw Stripe event |

`/payments/webhook` isn't in the collection — it's called by Stripe (or the `stripe listen` CLI forwarder), not by hand.

## Typical flow

1. Register an `OWNER`, login → `accessToken` saved.
2. Add Car → `carId` saved.
3. Register/login as a `RENTER`.
4. Create Booking with that `carId` → `bookingId` saved.
5. Checkout → open the returned `checkoutUrl`, pay with Stripe test card `4242 4242 4242 4242`.
6. My Payments → confirm status flips to `COMPLETED` once the webhook fires.

## Response shape

All success responses: `{ "message": string, "data": {...} }`. Errors: `{ "message": string }` with the matching HTTP status (400/401/403/404/409).

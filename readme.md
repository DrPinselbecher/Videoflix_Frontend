# Videoflix Frontend

![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Backend](https://img.shields.io/badge/Backend-Django_REST_API-darkgreen)
![Auth](https://img.shields.io/badge/Auth-HttpOnly_Cookies-red)
![Status](https://img.shields.io/badge/Status-In_Development-orange)

![Videoflix Logo](assets/icons/logo_icon.svg)

Videoflix Frontend is the client-side application for a Netflix-/Prime-Video-like streaming platform.

The project is built with **Vanilla JavaScript**, **HTML** and **CSS**. It communicates with a separate Django REST backend and uses secure authentication through **JWT HttpOnly cookies**.

---

## Related Repositories

| Repository | Link |
|---|---|
| Frontend | https://github.com/DrPinselbecher/Videoflix_Frontend |
| Backend | https://github.com/DrPinselbecher/Videoflix_Backend |

> [!IMPORTANT]
> This frontend requires the matching Videoflix backend. The backend repository contains the Django REST API, authentication, video processing and protected HLS streaming endpoints.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Backend Requirement](#backend-requirement)
- [Authentication Concept](#authentication-concept)
- [Frontend Routes](#frontend-routes)
- [Local Setup](#local-setup)
- [Backend Connection](#backend-connection)
- [Account Activation Flow](#account-activation-flow)
- [Password Reset Flow](#password-reset-flow)
- [E-Mail Templates](#e-mail-templates)
- [JSDoc Documentation](#jsdoc-documentation)
- [Development Notes](#development-notes)
- [Current Status](#current-status)
- [License](#license)

---

## Project Overview

> [!NOTE]
> This frontend belongs to the Videoflix full-stack project and is designed to work with the separate Django backend.

The frontend provides the user interface for:

- landing page
- user registration
- account activation
- login
- logout
- password reset
- video dashboard
- protected video playback
- legal pages such as privacy policy and imprint

The frontend does not store JWT tokens manually. Authentication is handled through secure cookies set by the backend.

---

## Tech Stack

| Area | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Documentation | JSDoc |
| Local Development | Visual Studio Code Live Server |
| Backend Communication | REST API |
| Authentication | JWT via HttpOnly cookies |

---

## Core Features

### Authentication

- user registration form
- login form
- logout handling
- password reset request
- password confirmation form
- account activation via e-mail link
- redirect handling after successful auth actions
- generic error display for authentication errors

### Video Platform

- protected video dashboard
- video overview
- video thumbnails
- video detail/playback page
- HLS playback support through backend-provided `.m3u8` and `.ts` files

### Frontend Behavior

- responsive layout
- toast messages for success and error states
- form validation
- privacy policy checkbox validation
- redirect handling after registration, login, activation and password reset
- backend communication with credentials enabled

---

## Backend Requirement

> [!IMPORTANT]
> This repository contains only the frontend. The Django backend is required separately.

Required backend repository:

```text
https://github.com/DrPinselbecher/Videoflix_Backend
```

The backend must provide:

- Django REST Framework API
- JWT authentication via HttpOnly cookies
- CORS configuration for the frontend origin
- account activation endpoint
- password reset endpoints
- protected video endpoint
- protected HLS playlist and segment endpoints
- local media/thumbnail delivery during development

Required backend local URL:

```text
http://127.0.0.1:8000
```

Expected local frontend URL:

```text
http://127.0.0.1:5500
```

The backend must allow this frontend origin:

```text
http://127.0.0.1:5500
```

---

## Authentication Concept

Videoflix uses secure cookie-based authentication.

The backend sets the following cookies after login:

| Cookie | Purpose |
|---|---|
| `access_token` | Authenticates protected API requests |
| `refresh_token` | Used to request a new access token |

The frontend does not access these tokens directly.

> [!IMPORTANT]
> JWT tokens must not be stored in `localStorage` or manually added to an `Authorization` header. The browser sends HttpOnly cookies automatically when requests use credentials.

Protected frontend requests must include credentials:

```js
fetch(url, {
  method: "GET",
  credentials: "include",
});
```

---

## Frontend Routes

Typical frontend pages:

| Page | Purpose |
|---|---|
| `index.html` | Landing page |
| `pages/auth/register.html` | User registration |
| `pages/auth/login.html` | User login |
| `pages/auth/activate.html` | Account activation |
| `pages/auth/password_reset.html` | Password reset request |
| `pages/auth/password_confirm.html` | Set new password |
| `pages/video_list/index.html` | Protected video dashboard |
| `pages/video_player/index.html` | Video playback |
| `pages/legal/privacy_policy.html` | Privacy policy |
| `pages/legal/imprint.html` | Imprint |

---

## Local Setup

### 1. Start the Backend

Clone and start the backend first:

```text
https://github.com/DrPinselbecher/Videoflix_Backend
```

Expected backend URL:

```text
http://127.0.0.1:8000
```

### 2. Open Frontend Project

Open this repository in Visual Studio Code.

### 3. Start Live Server

Right-click the root `index.html` file and select:

```text
Open with Live Server
```

Expected frontend URL:

```text
http://127.0.0.1:5500
```

---

## Backend Connection

The frontend communicates with the backend through REST API endpoints.

Expected backend base URL:

```text
http://127.0.0.1:8000
```

Expected backend endpoints:

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/register/` | Register user |
| `GET` | `/api/activate/<uidb64>/<token>/` | Activate account |
| `POST` | `/api/login/` | Login user |
| `POST` | `/api/logout/` | Logout user |
| `POST` | `/api/token/refresh/` | Refresh access token |
| `POST` | `/api/password_reset/` | Request password reset |
| `POST` | `/api/password_confirm/<uidb64>/<token>/` | Set new password |

### Video

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/video/` | Get video list |
| `GET` | `/api/video/<movie_id>/<resolution>/index.m3u8` | Get HLS playlist |
| `GET` | `/api/video/<movie_id>/<resolution>/<segment>` | Get HLS segment |

---

## Account Activation Flow

After registration, the backend sends an activation e-mail.

The e-mail link points to the frontend:

```text
http://127.0.0.1:5500/pages/auth/activate.html?uidb64=<uidb64>&token=<token>
```

The frontend extracts:

```text
uidb64
token
```

Then it calls the backend:

```text
GET /api/activate/<uidb64>/<token>/
```

Successful backend response:

```json
{
  "message": "Account successfully activated."
}
```

---

## Password Reset Flow

The backend sends a password reset e-mail.

The e-mail link points to the frontend:

```text
http://127.0.0.1:5500/pages/auth/password_confirm.html?uidb64=<uidb64>&token=<token>
```

The frontend extracts:

```text
uidb64
token
```

Then it sends the new password to the backend:

```text
POST /api/password_confirm/<uidb64>/<token>/
```

Example request body:

```json
{
  "new_password": "newSecurePassword123",
  "confirm_password": "newSecurePassword123"
}
```

---

## E-Mail Templates

The folder `EmailTemplates_Backend` contains templates intended for backend e-mails.

These templates can be used for:

- account activation e-mails
- password reset e-mails

> [!NOTE]
> The e-mails are sent by the backend. The frontend only provides the target pages for activation and password confirmation.

---

## JSDoc Documentation

This project includes generated JSDoc documentation.

Open the documentation locally:

### Windows

```bash
start docs/jsdoc/index.html
```

### macOS

```bash
open docs/jsdoc/index.html
```

### Linux

```bash
xdg-open docs/jsdoc/index.html
```

Alternatively, open this file manually:

```text
docs/jsdoc/index.html
```

---

## Development Notes

- The project uses Vanilla JavaScript without React, Angular or Vue.
- The backend and frontend are intentionally separated.
- All backend communication happens through REST API calls.
- Protected requests must send cookies with `credentials: "include"`.
- The frontend must not read or store JWT tokens manually.
- The backend is responsible for authentication, authorization, video processing and HLS delivery.
- The frontend is responsible for user interaction, form handling, redirects and video playback.
- The project should be started through Live Server during local development.

---

## Current Status

Implemented or expected frontend functionality:

- landing page
- registration
- login
- logout
- account activation redirect handling
- password reset request
- password confirmation handling
- protected video dashboard
- video playback page
- toast messages
- form validation
- JSDoc documentation

---

## License

This project is part of a Developer Akademie learning project.

The frontend template was provided for educational purposes and adapted for the Videoflix backend project.
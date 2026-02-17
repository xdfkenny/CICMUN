'''
# CICMUN Delegate Portal

This is a refactored Nuxt project for the Colegio Internacional de Caracas Model United Nations (CICMUN).

## Project Structure

- `data/committees.json`: Contains all the committee and leadership data. **Modify this file to update the conference information.**
- `pages/`: Contains the main views (Home, Delegates, SAMUN, JMUN).
- `components/`: Reusable Vue components.
- `server/api/`: Server-side API routes that serve the JSON data.

## How to Modify Data

To update the committees, chairs, co-chairs, or secretaries, simply edit the `data/committees.json` file. The structure is as follows:

```json
{
  "id": 1,
  "name": "Committee Name",
  "type": "SAMUN",
  "chairName": "Name",
  "chairPhoto": null,
  "coChairName": "Name",
  "coChairPhoto": null,
  "secretaryName": "Name",
  "secretaryPhoto": null,
  "topicA": "Topic Description",
  "topicB": "Topic Description"
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Firebase Admin Setup (Server)
Set these in your environment (not in git):
```
NUXT_FIREBASEADMIN_PROJECTID=
NUXT_FIREBASEADMIN_CLIENTEMAIL=
NUXT_FIREBASEADMIN_PRIVATEKEY=
```

## Role Email Lists (Environment Only)
Define role email lists in your `.env` and keep them out of source control:
```
NUXT_PUBLIC_STAFF_EMAILS=teacher1@school.edu,teacher2@school.edu
NUXT_PUBLIC_ADMIN_EMAILS=admin1@school.edu
NUXT_PUBLIC_SUPER_ADMIN_EMAILS=superadmin@school.edu
NUXT_ADMIN_EMAILS=admin1@school.edu
NUXT_SUPER_ADMIN_EMAILS=superadmin@school.edu
```
Public values are exposed to the client (used for client-side role hints). Server-only values are used for admin API access checks.

## Firestore Rules
Use `firestore.rules` as a starting point for role-based access control.

## Google Auth
Enable Google sign-in in Firebase Auth. The login page supports Google and email/password.

## Gallery Upload Guidelines
- Prefer JPG or WebP.
- Max width: 2500px (larger images slow the gallery).
- Target file size: < 600 KB when possible.
- Use clear event folder names inside `public/Gallery/`.
'''
# CICMUN

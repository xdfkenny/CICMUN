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
'''
# CICMUN

# prelegal

A platform for drafting legal documents.

## Mutual NDA Creator

A Next.js prototype: fill in a form with party and deal details, preview the generated Common
Paper Mutual NDA, and download it as a PDF.

## Development

The project has two parts: the `frontend` (Next.js) and a `backend` (Express + SQLite) that
provides the technical foundation for future features.

Install everything once:

```bash
npm run install:all
```

Start both the frontend (http://localhost:3000) and the backend (http://localhost:4000):

```bash
npm start
```

Stop them (also useful if a previous run was left running in the background):

```bash
npm stop
```

You can also run the frontend on its own:

```bash
cd frontend
npm install
npm run dev
```

## Status

This project will be complete within a week.

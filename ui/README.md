# Documents UI

## About The Project

### Built With

- [React](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev)
- [shadcn/ui](https://ui.shadcn.com/)

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Install the packages: `npm install`
2. With packages installed, run development command: `npm run dev`

### Tests

To run the tests, execute `npm run test`

## My jounery to complete this challenge

First, it's important to say that I faced issues with `bun`. It took me some time to get used with it but I was still having issues with it, specially with the `@tanstack` package when integrated into the integration tests. I was not able to figure out what was going on so I decide to leave it behind and used `node` instead.

Apart from that, it was super fun developing this UI. I decided to improve the UI a bit by using the `shadcn/ui` components and making it **responsive** using tailwindcss media queries.

For tests, I decided to use `jest` + `@testing-library/react` as I was already used to use them in previous projects.

### SSE and EventSource

One super cool thing about this project is that it used `EventSource` to stablish a persistent connection to the server which will stream data to the client.

The server implements a SSE event pattern that notifies the client whenever a document/file has finished processing or failed.

That way the client does not need to fetch the backend periodically, thus reducing the number of call to the server, potentially reducing costs.

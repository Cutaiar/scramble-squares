# scramble-squares

[![Netlify Status](https://api.netlify.com/api/v1/badges/966d0add-5b76-448d-9648-a65be9312a06/deploy-status)](https://app.netlify.com/sites/scramble-squares/deploys)

A minimal [Scramble Squares](https://scramblesquares.com/) implementation with plans for an interactive web toy, solver, and solution visualizer. [Demo](https://scramble.cutaiar.io/)

Goals include:

- performant, clever interactions
- support for even more powerful, snappy, keyboard interactions
- answering the question _"does this add value?"_

![demo](./demo.png)

## TODO

- Implement drag interaction with swapping between rows
- Implement solver
- Consider these reccomendations from Vite
  - Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
  - Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Idea: camscanner style import for any puzzle.
- Idea: AR overlay of moves nad rotations for solution

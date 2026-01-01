# gold-app
## Description
A mock app that lets you buy gold, with live pricing updates from a backend.
## Features
- Full from scratch node.js web server that serves static files
- Provides price information to user via endpoint `/api`
  - Served to frontend with server-sent events
  - Live generates new price every 10 seconds, stored in `data/price.txt`
  - Serves cached price if available when client connects
- Logs all user purchases in `data/purchases.txt`
  - Stores purchase amount, price, amount of gold sold, and timestamp
- Server side price validation to prevent fraud (i.e. calling the api with a fake price)
## Install and run
`npm install` -> `npm start` or `npm run dev` to run with nodemon

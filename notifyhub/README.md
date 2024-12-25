# Notifyhub

Listens to postgresql notifications and forward them to its websocket clients.

## Install

Install node and npm.

```
npm i
```

## Configure

Crete .env file:
```
PG_USER=...
PG_HOST=...
PG_DATABASE=...
PG_PASSWORD=...
PG_PORT=...
```

## Run

Developer version
```
npm run dev
```

With pm2

```
pm2 start node --name "zabbix-live-notifyhub" -- index.js

# or

./start.sh
```
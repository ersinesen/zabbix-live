# Web

Next.js backend/frontend of zabbix-live.


## Install

Install node and npm.

```
npm i
```

## Configure

Crete .env.local file:

```
LOGFILE=logs/web.log
PG_USER=...
PG_HOST=...
PG_DATABASE=...
PG_PASSWORD=...
PG_PORT=...
NOTIFYHUB_URL=ws://...:...
```

## Run

Developer version
```
npm run dev
```

With pm2

```
pm2 start npm --name "zabbix-live-web" -- run dev

# or

./start.sh
```
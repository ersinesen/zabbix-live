# Zabbix-live Postgresql Components

Create trigger and notification function in Zabbix Postgresql database.

Function and trigger definitions are in [triggers.sql](./triggers.sql).

## Client

Test notification channel with nodejs client utility.

Install

```
npm i
```

Create .enf file

```
DB_NAME=zabbix
DB_USER=zabbix
DB_PASSWORD=...
DB_HOST=...
DB_PORT=...
```

Run 

```
node index.js
```
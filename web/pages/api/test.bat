REM zabbix hosts
curl -s localhost:40100/api/zabbix/hosts | jq

REM zabbix items
curl -s "localhost:40100/api/zabbix/host/items?hostid=10650" | jq

REM zabbix item history 
curl -s "localhost:40100/api/zabbix/item/history?itemid=48877" | jq
curl -s "localhost:40100/api/zabbix/item/history?itemid=48877&t1=1735034273&t2=1735034373" | jq

# Zabbix Information and Snippets

## UI (version 7.2)

1. Change agent item setting

- Data Collection -> Hosts -> 
    
    - Search for item

    - Set its 'Update interval'



## Zabbix API

[Manual](https://www.zabbix.com/documentation/current/en/manual/api)

### Get Token

```
curl -k -X POST ^
    --url "https://192.168.11.15:10051/zabbix/api_jsonrpc.php" ^
    --header "Content-Type: application/json-rpc" ^
    --data "{\"jsonrpc\":\"2.0\",\"method\":\"apiinfo.version\",\"params\":{},\"id\":1}"

```


### Get Hosts

```
SET TOKEN=...

curl -k -X POST ^
   --url "https://192.168.11.15:10051/zabbix/api_jsonrpc.php" ^
   --header "Authorization: Bearer %TOKEN%" ^
   --header "Content-Type: application/json-rpc" ^
   --data "{ \"jsonrpc\": \"2.0\", \"method\": \"host.get\", \"params\": { \"output\": [ \"hostid\", \"host\" ], \"selectInterfaces\": [ \"interfaceid\", \"ip\" ] }, \"id\": 2 }"
   
```

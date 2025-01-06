#
# Test zabbix API
#
# Token: 1. create in Zabbix Web UI 2. get from API
# 
# EE Jan '25

source .env

# API Version
curl -X POST \
    --url "$URL" \
    --header "Content-Type: application/json-rpc" \
    --data "{\"jsonrpc\":\"2.0\",\"method\":\"apiinfo.version\",\"params\":{},\"id\":1}"

# Get Token
#curl --request POST \
#    --url "$URL" \
#    --header 'Content-Type: application/json-rpc' \
#    --data '{"jsonrpc":"2.0","method":"user.login","params":{"username":"zabbix","password":"..."},"id":1}'

# Get Hosts
DATA=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "host.get",
    "params": {
        "output": [
            "hostid",
            "host"
        ],
        "selectInterfaces": [
            "interfaceid",
            "ip"
        ]
    },
    "id": 2
}
EOF
)

curl --request POST \
    --url "$URL" \
    --header "Authorization: Bearer $TOKEN" \
    --header "Content-Type: application/json-rpc" \
    --data "$DATA" | jq

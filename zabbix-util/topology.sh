#
# Network topology discovery script for Zabbix.
# 
# EE Jan '25

source .env

# Get Hosts
DATA=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "host.get",
    "params": {
        "output": ["hostid", "host", "name", "groupid"],
        "selectInterfaces": ["interfaceid", "ip"],
        "selectGroups": ["groupid", "name"]
    },
    "id": 2
}
EOF
)

curl -s --request POST --url "$URL" --header "Authorization: Bearer $TOKEN" --header "Content-Type: application/json-rpc" --data "$DATA" | jq

# Get Host Groups
DATA=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "hostgroup.get",
    "params": {
        "output": ["groupid", "name"],
        "selectHosts": ["hostid", "name"] 
    },
    "id": 3
}
EOF
)

curl -s --request POST --url "$URL" --header "Authorization: Bearer $TOKEN" --header "Content-Type: application/json-rpc" --data "$DATA" | jq

# Get host interfaces
DATA=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "hostinterface.get",
    "params": {
        "output": "extend",         
        "hostids": ["10084","10651","10652"]
    },
    "id": 1006
}
EOF
)

curl -s --request POST --url "$URL" --header "Authorization: Bearer $TOKEN" --header "Content-Type: application/json-rpc" --data "$DATA" | jq

# Search
DATA=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "host.get",
    "params": {
        "filter": {
            "ip": "192.168.1.117"
        }
    },
    "id": 1001
}
EOF
)
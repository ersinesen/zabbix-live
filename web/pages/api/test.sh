curl "localhost:40100/api/devices"

curl "localhost:40100/api/sensors"

curl -s "http://localhost:40100/api/history?devices=tlp007&sensor=cpu&field=value" 

curl -s "http://localhost:40100/api/history?devices=tlp007&sensor=cpu&field=value&start_time=2024-08-07T00:00:00Z&end_time=2024-08-08T01:00:00Z"

curl -s "http://localhost:40100/api/topchart?sensor=cpu&field=value&topN=20"

curl -s "http://localhost:40100/api/process?device=tlp007&start_time=2024-08-12&end_time=2024-08-13"

curl -s "localhost:40100/api/notifyhub"

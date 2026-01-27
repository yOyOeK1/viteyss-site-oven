{
    "autoStatr": false,
    "setENV": false,
    "mediumProtocal": "cmd",
    "topicAddress": "mkfifo /tmp/0_ch_noti; lNo=0; while true; do echo \"read fife ... pid $$\"; resN=`cat /tmp/0_ch_noti`; titleN=$(echo \"$resN\" | jq .title -r); msgN=$(echo \"$resN\" | jq .msg -r); notify-send \"$titleN\" \"$msgN\"; sleep 1; done",
    "rName": "notification reciver",
    "valType": "raw",
    "wrapType": "log",
    "liveSes": false,
    "intervalEverySec": 0,
    "iterator": -1,
    "sharedSession": true,
    "onlyWhenImOnline": false,
    "saveChannelNo": 11
}
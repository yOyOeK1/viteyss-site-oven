{
    "mediumProtocal": "cmd",
    "topicAddress": "batperc=`acpi -b | awk '{print $4}' | replace '%,' ''`; test \"$batperc\" -le 27 && echo $batperc",
    "rName": "Battery low detected 27",
    "valType": "percent bar",
    "wrapType": "toast",
    "liveSes": false,
    "intervalEverySec": 60,
    "iterator": -1,
    "sharedSession": true,
    "onlyWhenImOnline": false
}
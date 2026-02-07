#!/bin/bash

tOfC=3
echo "Long task playground [$tOfC]"
date
echo "pwd: "`pwd`
echo "args: [$*]"
sleep .1
free
sleep .2

uptime
for i in {0..30};do
    sleep 1
    echo "fake work "$i" / "$tOfC

done

exWil=$(($RANDOM % 3))
echo "DONE lonk fake task exit with: "$exWil
exit $exWil
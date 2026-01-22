#!/bin/bash

echo "Long task playground"
date
echo "pwd: "`pwd`
echo "args: [$*]"
sleep .1
free
sleep .2
uptime
for i in {0..60};do
    sleep 1
    echo "fake work "$i

done

echo "DONE lonk fake task"
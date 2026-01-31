#!/bin/bash

projectsDir="$HOME/Apps/"

tree -L 1 -d "$projectsDir" | \
grep -v '_old' | grep -v '_org' | grep -v '_back' | \
grep -e 'node-yss' -e 'mnodehttp' -e 'viteyss' -e 'odtmtools' | \
awk '{print $2}' | while read dName; do
    
    test -e "$projectsDir""/""$dName""/package.json" && echo $dName
    

done

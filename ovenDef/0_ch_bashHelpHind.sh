#!/bin/bash

## for termux
##!/data/data/com.termux/files/usr/bin/bash


ver="2601242209"

apphelp=$1

test "$apphelp" = "" && \
echo '# EE arg1 need to be app name' && exit 1


lNum=1 # 1 - as yes
separ='------------------------'



he=`$apphelp --help`
test "$?" != '0' && \
echo '# error on doing help' \
|| \
echo "$he"
line='--help' && \
while true; do
    
    echo -en "#[$lNum]N \e[1m""$apphelp""\e[0m search for:"
    read -r line
    
    if test "$line" = "q";then
        echo '# quit ...'
        break
    elif test "$line" = "n";then
        lNum=`test "$lNum" = "1" && echo "0" || echo "1"`
    else
        mCount=`echo "$he" | grep -i "$line" | wc -l `
        
        if test "$lNum" = "1"; then
             
            echo "$he" | grep \
	            --colour=always \
	            --group-separator="$separ" \
	            -C 3 -n \
	            -i "$line"
        
        
        else
            
            echo "$he" | grep \
	            --colour=always \
	            --group-separator='------------------------' \
	            -C 3 \
	            -i "$line"
        
        fi
        
        echo " result ( $mCount ) [ $line ] --- "`date`
    fi
    
done

echo '#  done'

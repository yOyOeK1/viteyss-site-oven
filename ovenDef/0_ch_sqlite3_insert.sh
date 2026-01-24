#!/bin/bash


# ./0_ch_sqlite3_insert.sh "tab1" "/tmp/dbTab1.db" "$(date)"
# ./0_ch_sqlite3_insert.sh "tab1" "/tmp/dbTab1.db" '1111 abc" 2222'


tableName="$1"
targetDBPath="$2"

qWhat="$3"


test "$tableName" = "" && echo "# EE arg0 - table name" && exit 1
test "$targetDBPath" = "" && echo "# EE arg1 - path to db file" && exit 1
test "$qWhat" = "" && echo "# EE arg3 - what to insert is empty" && exit 1

safe_What=$(printf "'%s'" "$qWhat")

cmds="

INSERT INTO 
    "$tableName"
( vMsg, entryDate ) VALUES ( $safe_What, '`date +%s`' ) ;

"


# insert into sample_table (Name, Age) values ("JDoe", 42), ("JRoe", 43);
# Pipe the commands to `sqlite3` while also passing the database file path.
echo -e "# sql\n""$cmds""\n# sql --- END"
echo "$cmds" | sqlite3 "$targetDBPath" && echo "# --- DONE" || \
echo "# EE sql query error exit 1" && exit 1

#!/bin/bash


# ./0_ch_sqlite3_select.sh "tab1" "/tmp/dbTab1.db"
# ./0_ch_sqlite3_select.sh "tab1" "/tmp/dbTab1.db" "vMsg,id"
# ./0_ch_sqlite3_select.sh "tab1" "/tmp/dbTab1.db" "id as 'Id:', vMsg as 'Value', entryDate as 'Date of entry'"
# ./0_ch_sqlite3_select.sh "tab1" "/tmp/dbTab1.db" "vMsg,id" "id%2=0"

tableName="$1"
targetDBPath="$2"

qWhat="$3"
qWhere="$4"


test "$tableName" = "" && echo "# EE arg0 - table name" && exit 1
test "$targetDBPath" = "" && echo "# EE arg1 - path to db file" && exit 1
test "$qWhat" = "" && qWhat="*"
test "$qWhere" = "" && qWhere="1"


cmds='
SELECT '"$qWhat"' FROM '"$tableName"' WHERE '"$qWhere"';
'

# insert into sample_table (Name, Age) values ("JDoe", 42), ("JRoe", 43);
# Pipe the commands to `sqlite3` while also passing the database file path.
echo "$cmds" | sqlite3 "$targetDBPath" && echo "# --- DONE" || \
echo "# EE sql query error exit 1" && exit 1

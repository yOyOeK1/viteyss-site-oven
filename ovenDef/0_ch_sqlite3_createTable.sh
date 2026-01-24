#!/bin/bash

# ./0_ch_sqlite3_createTable.sh "tab1" "/tmp/dbTab1.db"


tableName="$1"
targetDBPath="$2"

test "$tableName" = "" && echo "# EE arg0 - table name" && exit 1
test "$targetDBPath" = "" && echo "# EE arg1 - path to db file" && exit 1

cmds='

CREATE TABLE '"$tableName"' (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vMsg TEXT,
  entryDate INTEGER
);

'



# insert into sample_table (Name, Age) values ("JDoe", 42), ("JRoe", 43);
# Pipe the commands to `sqlite3` while also passing the database file path.
echo "$cmds" | sqlite3 "$targetDBPath" && echo "# --- DONE" || \
echo "# EE sql query error exit 1" && exit 1

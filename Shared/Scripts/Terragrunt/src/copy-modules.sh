#!/bin/bash

BASE_PATH=$1
IFS=,
set -- $2
for f; do
  cp -r "$BASE_PATH/$f" ..
done

#!/usr/bin/env bash

output_file=$1

rm -rf $output_file

gofakeit firstname -loop=100000 > "$output_file"

sort "$output_file" | uniq -u
sed -ie 's/^/"/g' "$output_file"
sed -ie 's/$/",/g' "$output_file"
sed -ie '$ s/,$//g' "$output_file"

file_content=$(cat $output_file)
echo "[$file_content]" > $output_file

rm -rf "${output_file}e"
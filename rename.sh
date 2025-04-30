#!/bin/bash

# Step 1: Rename all files starting with "Iota" to start with "Iota"
find . -type f -name 'Iota*' | while read file; do
  dir="$(dirname "$file")"
  old_base="$(basename "$file")"
  new_base="Iota${old_base#Iota}"
  git mv "$file" "$dir/$new_base"
done

# Step 2: Update import/require paths in all .ts and .tsx files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) | while read tsfile; do
  sed -i 's/\(from\s.\{0,1\}\)\(Iota\)/\1Iota/g' "$tsfile"
  sed -i 's/\(require(\s*.\{0,1\}\)\(Iota\)/\1Iota/g' "$tsfile"
done

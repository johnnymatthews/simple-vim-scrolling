#!/bin/bash

# Script to build a browser extension

# Set variables
OUTPUT_FILE="simple-vim-scrolling.zip"
FILES_TO_INCLUDE=(
  "manifest.json"
  "page-navigator.js"
  "icons"
)

# Check if output file already exists
if [ -f "$OUTPUT_FILE" ]; then
  echo "Output file $OUTPUT_FILE already exists. Removing it."
  rm "$OUTPUT_FILE"
fi

# Create zip file with the required files and directories
echo "Creating extension zip file: $OUTPUT_FILE"
zip -r "$OUTPUT_FILE" "${FILES_TO_INCLUDE[@]}"

# Check if zip was successful
if [ $? -eq 0 ]; then
  echo "Extension successfully built: $OUTPUT_FILE"
  echo "Contents of the zip file:"
  unzip -l "$OUTPUT_FILE"
else
  echo "Error building extension."
  exit 1
fi

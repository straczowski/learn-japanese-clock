#!/bin/bash

INPUT_DIR="public/sound/voice-wav"
OUTPUT_DIR="public/sound/voice"

if [ ! -d "$INPUT_DIR" ]; then
  echo "Error: Input directory '$INPUT_DIR' does not exist"
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "Error: ffmpeg is not installed. Please install ffmpeg first."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

for wav_file in "$INPUT_DIR"/*.wav; do
  if [ -f "$wav_file" ]; then
    filename=$(basename "$wav_file" .wav)
    output_file="$OUTPUT_DIR/${filename}.webm"
    
    echo "Converting: $wav_file -> $output_file"
    ffmpeg -i "$wav_file" -codec:a libopus -b:a 128k -y "$output_file" -loglevel error
    
    if [ $? -eq 0 ]; then
      echo "✓ Successfully converted: $filename"
    else
      echo "✗ Failed to convert: $filename"
    fi
  fi
done

echo "Conversion complete!"

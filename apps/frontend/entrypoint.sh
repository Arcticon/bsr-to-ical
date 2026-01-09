#!/bin/sh

# Find all JS files in the output directory
# Replace the placeholder string with the actual ENV variable
find .output -type f -name "*.mjs" -exec sed -i "s|__VITE_BACKEND_URL_PLACEHOLDER__|${VITE_BACKEND_URL}|g" {} +

# Execute the original command (start the server)
exec "$@"
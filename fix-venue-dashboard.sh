#!/bin/bash
FILE="app/dashboard/venue/events/page.tsx"
if [ -f "$FILE" ]; then
  cp "$FILE" "$FILE.bak"
  # Remove any vertical filter (show all verticals)
  sed -i '/vertical/d' "$FILE"
  # Ensure only user_id filter remains
  sed -i "s/\.eq('status', 'Live')//g" "$FILE"
  echo "✅ Fixed venue dashboard to show all verticals"
else
  echo "File not found, searching..."
  find app/dashboard/venue -name "*.tsx" -exec grep -l "My Events" {} \;
fi

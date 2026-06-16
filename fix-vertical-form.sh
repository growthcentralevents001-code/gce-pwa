#!/bin/bash
echo "🔧 Adding vertical dropdown to venue create-event form..."

# 1. Create event form (venue dashboard)
CREATE_FILE="app/dashboard/venue/create-event/page.tsx"
if [ -f "$CREATE_FILE" ]; then
  cp "$CREATE_FILE" "${CREATE_FILE}.bak"
  # Add vertical field after category selection or in the form
  sed -i '/<form/i\
  const [vertical, setVertical] = useState("marketplace");\
' "$CREATE_FILE"
  sed -i '/<form/i\
  // Vertical options\
  const verticalOptions = [\
    { value: "connect", label: "GCE Connect" },\
    { value: "marketplace", label: "GCE Marketplace" },\
    { value: "enterprise", label: "GCE Enterprise" }\
  ];\
' "$CREATE_FILE"
  sed -i '/<form/i\
  <div className="mb-4">\
    <label className="block text-sm font-medium mb-1">Event Vertical</label>\
    <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="w-full p-2 border rounded">\
      {verticalOptions.map(opt => (\
        <option key={opt.value} value={opt.value}>{opt.label}</option>\
      ))}\
    </select>\
  </div>\
' "$CREATE_FILE"
  # Also ensure submit includes vertical
  sed -i 's/const { data, error } = await supabase.from("events").insert({/&\n    vertical,/' "$CREATE_FILE"
  echo "✅ Updated create-event form"
else
  echo "⚠️ Create-event form not found at $CREATE_FILE"
fi

# 2. Edit event form (if exists)
EDIT_FILE="app/dashboard/venue/events/edit/[id]/page.tsx"
if [ -f "$EDIT_FILE" ]; then
  cp "$EDIT_FILE" "${EDIT_FILE}.bak"
  # Similar changes for edit form
  sed -i '/const \[event, setEvent\]/a\
  const [vertical, setVertical] = useState(event?.vertical || "marketplace");\
' "$EDIT_FILE"
  sed -i '/<form/i\
  <div className="mb-4">\
    <label className="block text-sm font-medium mb-1">Event Vertical</label>\
    <select value={vertical} onChange={(e) => setVertical(e.target.value)} className="w-full p-2 border rounded">\
      <option value="connect">GCE Connect</option>\
      <option value="marketplace">GCE Marketplace</option>\
      <option value="enterprise">GCE Enterprise</option>\
    </select>\
  </div>\
' "$EDIT_FILE"
  sed -i 's/\.update({/&\n    vertical,/' "$EDIT_FILE"
  echo "✅ Updated edit-event form"
fi

# 3. Admin create event form (if exists)
ADMIN_FILE="app/admin/events/create/page.tsx"
if [ -f "$ADMIN_FILE" ]; then
  cp "$ADMIN_FILE" "${ADMIN_FILE}.bak"
  sed -i '/<form/i\
  <div className="mb-4">\
    <label>Event Vertical</label>\
    <select name="vertical" className="w-full p-2 border rounded">\
      <option value="connect">GCE Connect</option>\
      <option value="marketplace">GCE Marketplace</option>\
      <option value="enterprise">GCE Enterprise</option>\
    </select>\
  </div>\
' "$ADMIN_FILE"
  echo "✅ Updated admin create-event form"
fi

echo "🎉 Form updates done. Rebuilding..."
rm -rf .next
npm run build
pm2 restart gce-dev
pm2 save
echo "✅ Done. Hard refresh browser and check create-event page - vertical dropdown should appear."

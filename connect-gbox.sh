#!/bin/bash
# Gbox.ai Connection Script for Linux/Mac

BOX_ID="f28be75f-90d2-41a0-9789-b525b6006180"
API_KEY="gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0"

echo "🔗 Connecting to gbox.ai..."
echo "Box ID: $BOX_ID"
echo ""

# Note: Gbox.ai typically provides ADB endpoints through their dashboard
# You'll need to get the connection string from the gbox.ai interface

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Please install Android SDK platform-tools."
    exit 1
fi

echo "✅ ADB found: $(adb version | head -n 1)"
echo ""
echo "📝 To connect:"
echo "1. Visit https://gbox.ai and log in"
echo "2. Find your box ($BOX_ID) and get the ADB connection endpoint"
echo "3. It should look like: <host>:<port> or <ip>:<port>"
echo ""
echo "💡 Once you have the endpoint, run:"
echo "   adb connect <endpoint>"
echo "   adb devices"
echo ""
echo "🚀 Then start Expo:"
echo "   npm start"
echo "   Press 'a' to open on Android"






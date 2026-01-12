# Gbox.ai MCP Server Setup for Cursor IDE

## Configuration Created

I've created the MCP server configuration at `.cursor/mcp.json` with:
- ✅ Package: `@gbox.ai/mcp-server@latest` (new package name)
- ✅ API Key: Configured in the env section
- ✅ Box ID: `f28be75f-90d2-41a0-9789-b525b6006180`

## Configuration File

```json
{
  "mcpServers": {
    "gbox-android": {
      "command": "npx",
      "args": [
        "-y",
        "@gbox.ai/mcp-server@latest"
      ],
      "env": {
        "GBOX_API_KEY": "gbox_4W4NuWVGNJGrVjSoSfNoFxqBcLZdrMqzRKNMTdoijnigfzRiV0"
      }
    }
  }
}
```

## Next Steps

1. **Restart Cursor IDE** to load the MCP server configuration
2. **Verify MCP server is running** - you should see it in Cursor's MCP status
3. **Access Gbox.ai capabilities** - I can now query the MCP server to:
   - Get ADB connection endpoints for your box
   - Control the Android device
   - Take screenshots
   - Run commands
   - And more!

## Using the MCP Server

Once Cursor restarts, I'll be able to use MCP tools to:
- Get the ADB connection endpoint for your box
- Connect to the device via ADB
- Start testing your app
- Monitor logs and debug issues

## Alternative: Global Configuration

If the project-level config doesn't work, you can also add it to your global Cursor config:

**Windows**: `%USERPROFILE%\.cursor\mcp.json`

## Testing

After restarting Cursor, I should be able to access gbox.ai MCP tools directly, which will allow me to get the ADB connection endpoint and help you test the app!






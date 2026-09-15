import { MCPClient } from '@mastra/mcp';

/**
 * Bright Data runs a hosted MCP server, so there is nothing to install and no
 * proxy or headless browser to maintain. You connect to one URL with your token.
 *
 * With no groups configured, the agent gets search and scraping:
 *   search_engine            Google, Bing, or Yandex results as structured data
 *   search_engine_batch      up to 10 searches in one call
 *   scrape_as_markdown       any URL as clean Markdown
 *   scrape_batch             up to 10 URLs in one call
 *   ask_brightdata_assistant delegate an open-ended web question
 *
 * Set BRIGHT_DATA_MCP_GROUPS to swap in platform-specific tools instead.
 * Note: the hosted server applies one group, and setting a group drops the
 * two batch tools, so leave it empty unless you need a specific platform.
 */
const token = process.env.BRIGHT_DATA_API_TOKEN?.trim();

function buildUrl(apiToken: string) {
  const url = new URL('https://mcp.brightdata.com/mcp');
  url.searchParams.set('token', apiToken);

  const group = process.env.BRIGHT_DATA_MCP_GROUPS?.trim();
  if (group) {
    url.searchParams.set('groups', group);
  }

  return url;
}

/**
 * The server is only registered when a token is present. Without it the client
 * has no servers and the app still starts. The first research request reports
 * the missing token instead of generating an answer without web access.
 */
export const brightData = new MCPClient({
  id: 'bright-data',
  servers: token
    ? {
        // Tools arrive namespaced by this key, e.g. `brightData_search_engine`.
        brightData: {
          url: buildUrl(token),
          // Unblocking a protected page can take a while. Give it room.
          timeout: 120_000,
        },
      }
    : {},
});

type BrightDataTools = Awaited<ReturnType<typeof brightData.listTools>>;

let toolsPromise: Promise<BrightDataTools> | undefined;

// Share successful tool discovery across requests. Retry discovery on the next
// request if it fails, and never run research without web tools.
export async function loadBrightDataTools() {
  if (!token) {
    throw new Error('Set BRIGHT_DATA_API_TOKEN in .env and restart the server to enable web research.');
  }

  toolsPromise ??= (async () => {
    const tools = await brightData.listTools();
    if (Object.keys(tools).length === 0) {
      throw new Error('Bright Data returned no tools. Check your API token and connection before trying again.');
    }
    return tools;
  })().catch(error => {
    toolsPromise = undefined;
    throw error;
  });

  return toolsPromise;
}

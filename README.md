# Web research agent with Bright Data

Ask a question or provide a public URL. The agent searches the web, reads relevant pages, and returns an answer with source links. The `research-brief` workflow returns a summary, key points, and sources as structured JSON. Built with Mastra and Bright Data’s hosted MCP server.

## Why we built this

Web research requires both finding relevant pages and retrieving their content. Some sites block ordinary HTTP requests or return incomplete pages. This template uses Bright Data for search and page retrieval, with a conversational agent for questions and a workflow for structured research briefs. Retrieval can still fail, and answers depend on the sources available.

## Features

- Search Google, Bing, or Yandex and read public pages as Markdown.
- Answer questions with links to the pages used as sources.
- Batch up to ten searches or page reads when using the default tools.
- Return research as JSON with `topic`, `summary`, `keyPoints`, and `sources` fields.
- Enable platform-specific tools for product listings, company profiles, or social posts.

### Prerequisites

- [**OpenAI API key**](https://platform.openai.com/api-keys) — used by default, but you can swap in any model
- [**Bright Data API token**](https://brightdata.com/cp/setting/users) — for web search and page scraping

## Quickstart 🚀

1. **Clone the template**
   - Run `npx create-mastra@latest --template bright-data-agent` to scaffold the project locally.
2. **Add your API keys**
   - Copy `.env.example` to `.env` and fill in your keys.
3. **Start the dev server**
   - Run `npm run dev` and open [localhost:4111](http://localhost:4111) to try it out.

Set `OPENAI_API_KEY` and `BRIGHT_DATA_API_TOKEN` in `.env`. Leave `BRIGHT_DATA_MCP_GROUPS` empty to use the default search and scraping tools. Restart the server after changing your keys.

If you cloned this repository directly, run `npm install` in the repository directory before starting the dev server.

Open the Studio URL printed in your terminal, normally [localhost:4111](http://localhost:4111). Select **Web Agent** and enter:

> Read https://www.amazon.com/dp/B0BDHWDR12 and report the product name, current price, and star rating. Include the source URL and identify any fields you cannot retrieve.

The agent should return the available product details with a source link. Product availability and page content may vary.

To try structured output, select the **research-brief** workflow and run it with:

```json
{
  "topic": "What are the differences between SQLite and PostgreSQL for a small web application? Use their official documentation."
}
```

The workflow searches and reads sources, then returns a JSON brief containing a summary, key points, and source titles and URLs.

Studio can start without a Bright Data token, but research requests require working web tools. If tool discovery fails, the request reports an error and the next request tries discovery again.

## Platform-specific tools

Set `BRIGHT_DATA_MCP_GROUPS` in `.env` to enable a platform group:

```bash
BRIGHT_DATA_MCP_GROUPS=ecommerce
```

| Group | Tools for |
|---|---|
| `ecommerce` | Amazon, Walmart, eBay, Best Buy, Etsy, Home Depot, Zara, Google Shopping |
| `social` | LinkedIn, Instagram, TikTok, YouTube, X, Reddit, Facebook |
| `business` | Crunchbase, ZoomInfo, Google Maps reviews, Zillow, Booking.com |
| `browser` | Remote browser navigation, clicks, typing, scrolling, and screenshots |
| `geo` | ChatGPT, Grok, and Perplexity answers as structured data |

The hosted server has these configuration constraints:

- One group applies per connection. A comma-separated list uses only the first entry.
- Enabling a group removes the `search_engine_batch` and `scrape_batch` tools.
- An unrecognized group name is ignored, leaving the default tools available.

Leave the variable empty unless you need a particular group.

## Making it yours

- Change `briefSchema` and the prompts in [the research workflow](src/mastra/workflows/research-brief.ts) to produce fields for your application, such as product comparisons or company research.
- Connect the agent or workflow to an application using the [Mastra Client SDK](https://mastra.ai/docs/server/mastra-client).

For an alternative to the hosted MCP connection, [`@mastra/brightdata`](https://mastra.ai/integrations/tools/brightdata) provides search and page-fetching tools through the Bright Data SDK. It requires Bright Data zones configured on your account and does not include the MCP batch tools or platform groups described above.

## About Mastra templates

[Mastra templates](https://mastra.ai/templates) are example projects built with Mastra. The [contributing guide](./CONTRIBUTING.md) describes how to submit changes through the Mastra monorepo.

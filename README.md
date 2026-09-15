# Web research agent with Bright Data

Ask a question or provide a public URL. The agent searches the web, reads relevant pages, and returns an answer with source links. The `research-brief` workflow returns a summary, key points, and sources as structured JSON. Built with Mastra and Bright Data’s hosted MCP server.

## Why we built this

Web research requires both finding relevant pages and retrieving their content. Some sites block ordinary HTTP requests or return incomplete pages. This template uses Bright Data for search and page retrieval, with a conversational agent for questions and a workflow for structured research briefs. Retrieval can still fail, and answers depend on the sources available.

## Demo

<video controls width="640" height="360" src="https://res.cloudinary.com/mastra-assets/video/upload/v1789407162/bright-data-agent-demo_1_iclc5b.mp4"></video>

## Prerequisites

- [**OpenAI API key**](https://platform.openai.com/api-keys): set `OPENAI_API_KEY` for the default model, `openai/gpt-5.6-luna`. You can change the model in the agent configuration; another provider may require different credentials.
- [**Bright Data API token**](https://brightdata.com/cp/setting/users): set `BRIGHT_DATA_API_TOKEN` for web search and page scraping.

## Quickstart 🚀

1. **Clone the template**
   - Run `npx create-mastra@latest --template bright-data-agent` to scaffold the project locally.
   - Enter the generated project directory and run `npm install` if dependencies were not installed during setup.
2. **Add your API keys**
   - Run `cp .env.example .env` and fill in the values described under Prerequisites.
3. **Start the dev server**
   - Run `npm run dev` and open [localhost:4111](http://localhost:4111), or the Studio URL printed in your terminal.
   - Select **Web Agent** and try the product-page prompt below. The agent should return available product details with a source link.

## Try it out

- Ask **Web Agent**: “Read https://www.amazon.com/dp/B0BDHWDR12 and report the product name, current price, and star rating. Include the source URL and identify any fields you cannot retrieve.” Look for details supported by the page and an explanation of anything missing. Product availability and page content may vary.
- Ask **Web Agent**: “Compare SQLite and PostgreSQL for a small web application using their official documentation. Read the relevant pages and include source links.” Look for a comparison based on retrieved pages, with links you can inspect.
- Run **research-brief** with `{"topic":"What are the differences between SQLite and PostgreSQL for a small web application? Use their official documentation."}`. The workflow first searches and reads sources, then writes a brief from those findings with no further web calls. The JSON result contains `topic`, `summary`, `keyPoints`, and source titles and URLs.

## Customization

- Open the project in your coding agent and ask: “Adapt the research brief to compare a list of product URLs, returning available prices, specifications, and source links. Explore the code and propose a plan before making changes.” The output schema and research prompts are in [the research workflow](src/mastra/workflows/research-brief.ts).
- Connect the agent or workflow to an application using the [Mastra Client SDK](https://mastra.ai/docs/server/mastra-client).

## Platform-specific tools

Set `BRIGHT_DATA_MCP_GROUPS` in `.env` and restart the dev server to enable a platform group:

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

For an alternative to the hosted MCP connection, [`@mastra/brightdata`](https://mastra.ai/integrations/tools/brightdata) provides search and page-fetching tools through the Bright Data SDK. It requires Bright Data zones configured on your account and does not include the MCP batch tools or platform groups described above.

## Tool connection errors

Studio can start without a Bright Data token, but research requests require working web tools. If tool discovery fails, the request reports an error and the next request tries discovery again. Restart the server after changing your API keys.

## About Mastra templates

This partnership template was contributed by Bright Data to show how Mastra uses Bright Data’s search and page-retrieval tools for web research. Partnership templates live in their own repositories.

[Want to contribute?](https://github.com/danielsha-brd/mastra-template-bright-data-agent)

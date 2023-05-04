/* empty css                           */import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, e as renderSlot, f as renderComponent, m as maybeRenderHead } from '../astro.2f6101c7.mjs';
import { createParser } from 'eventsource-parser';
import { createOpenjourney } from 'replicate-fetch';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/svg+xml" href="/openai.webp">
    <link href="/remixicon.css" rel="stylesheet">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body>
    ${renderSlot($$result, $$slots["default"])}
  </body></html>`;
}, "/Users/wong/Desktop/tp/react/chatgpt-vercel.io/src/layouts/Layout.astro");

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = ({}).LANGUAGE || process.env.LANGUAGE || "en";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "ChatGPT", "class": "astro-J7PV25F6" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<div id="container" class="astro-J7PV25F6">
    ${renderComponent($$result2, "Main", null, { "lang": lang, "client:only": "react", "client:component-hydration": "only", "class": "astro-J7PV25F6", "client:component-path": "@modules/Main", "client:component-export": "default" })}
  </div>` })}`;
}, "/Users/wong/Desktop/tp/react/chatgpt-vercel.io/src/pages/index.astro");

const $$file = "/Users/wong/Desktop/tp/react/chatgpt-vercel.io/src/pages/index.astro";
const $$url = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const apiKeys = (({}).OPENAI_API_KEY || process.env.OPENAI_API_KEY)?.split(",") ?? [];
const disableProxy = ({}).DISABLE_LOCAL_PROXY === "true";
const localProxy = ({}).LOCAL_PROXY;
const apiBaseUrl = ({}).OPENAI_API_BASE_URL || process.env.OPENAI_API_BASE_URL || "api.openai.com";
const baseURL = (process.env.NODE_ENV === "development" && !disableProxy ? localProxy : apiBaseUrl)?.replace(/^https?:\/\//i, "");
const apiKeyStrategy = ({}).API_KEY_STRATEGY || process.env.API_KEY_STRATEGY || "random";
const password = ({}).PASSWORD || process.env.PASSWORD;
const config = {
  runtime: "edge",
  regions: [
    "arn1",
    "bom1",
    "bru1",
    "cdg1",
    "cle1",
    "cpt1a",
    "dub1",
    "fra1",
    "gru1",
    "hnd1",
    "iad1",
    "icn1",
    "kix1",
    "lhr1",
    "pdx1",
    "sfo1",
    "sin1",
    "syd1"
  ]
};

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  apiBaseUrl,
  apiKeyStrategy,
  apiKeys,
  baseURL,
  config,
  disableProxy,
  localProxy,
  password
}, Symbol.toStringTag, { value: 'Module' }));

const supportedModels = [
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301"
];
const defaultModel = "gpt-3.5-turbo";

const serverGlobalConfigs = {
  // load balancer polling step
  polling: 0
};

function loadBalancer(arr, strategy = "random") {
  if (!Array.isArray(arr) || arr.length === 0)
    return () => null;
  if (arr.length === 1)
    return () => arr[0];
  if (strategy === "polling") {
    return () => arr[serverGlobalConfigs.polling++ % arr.length];
  }
  return () => arr[Math.floor(Math.random() * arr.length)];
}

const post$1 = async ({ request }) => {
  if (!baseURL) {
    return new Response(JSON.stringify({ msg: "No LOCAL_PROXY provided" }), {
      status: 400
    });
  }
  const body = await request.json();
  const { messages, temperature = 1, password: password$1 } = body;
  let { key, model } = body;
  if (!key) {
    const next = loadBalancer(apiKeys, apiKeyStrategy);
    key = next();
  }
  model = model || defaultModel;
  if (password && password$1 !== password) {
    return new Response(
      JSON.stringify({ msg: "No password or wrong password" }),
      {
        status: 401
      }
    );
  }
  if (!key) {
    return new Response(JSON.stringify({ msg: "No API key provided" }), {
      status: 400
    });
  }
  if (!supportedModels.includes(model)) {
    return new Response(
      JSON.stringify({ msg: `Not supported model ${model}` }),
      {
        status: 400
      }
    );
  }
  try {
    const res = await fetch(`https://${baseURL}/v1/chat/completions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      method: "POST",
      body: JSON.stringify({
        model,
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content
        })),
        temperature,
        stream: true
      })
    });
    if (!res.ok) {
      return new Response(res.body, {
        status: res.status
      });
    }
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const streamParser = (event) => {
          if (event.type === "event") {
            const { data } = event;
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta?.content || "";
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };
        const parser = createParser(streamParser);
        for await (const chunk of res.body)
          parser.feed(decoder.decode(chunk));
      }
    });
    return new Response(stream);
  } catch (e) {
    console.log("Error", e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500
    });
  }
};

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  config,
  post: post$1
}, Symbol.toStringTag, { value: 'Module' }));

const post = async ({ request }) => {
  if (!baseURL) {
    return new Response(JSON.stringify({ msg: "No LOCAL_PROXY provided" }), {
      status: 400
    });
  }
  const body = await request.json();
  const { prompt, model, size = "256x256", n = 1, password: password$1 } = body;
  let { key } = body;
  if (!key) {
    const next = loadBalancer(apiKeys, apiKeyStrategy);
    key = next();
  }
  if (password && password$1 !== password) {
    return new Response(
      JSON.stringify({ msg: "No password or wrong password" }),
      {
        status: 401
      }
    );
  }
  if (!key) {
    return new Response(JSON.stringify({ msg: "No API key provided" }), {
      status: 400
    });
  }
  try {
    if (model === "Midjourney") {
      const len = size?.split("x")?.[0] ?? 256;
      const data2 = await createOpenjourney({
        prompt,
        width: Number(len),
        height: Number(len)
      });
      return new Response(
        JSON.stringify({
          data: data2 ?? []
        }),
        { status: 200 }
      );
    }
    const image = await fetch(`https://${baseURL}/v1/images/generations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
      },
      method: "POST",
      body: JSON.stringify({
        prompt,
        size,
        n
      })
    });
    const data = await image.json();
    const { data: images = [], error } = data;
    if (error?.message) {
      throw new Error(error.message);
    }
    return new Response(
      JSON.stringify({
        data: images?.map((img) => img.url) || []
      }),
      { status: 200 }
    );
  } catch (e) {
    console.log("Error", e);
    return new Response(JSON.stringify({ msg: e?.message || e?.stack || e }), {
      status: 500
    });
  }
};

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  config,
  post
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c };

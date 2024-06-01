import { useState } from "react";
import { Button, Heading, Text } from "@radix-ui/themes";
import { Readability } from "@mozilla/readability";
import styles from "./App.module.scss";

function App() {
  const [content, setContent] = useState<string>("");
  return (
    <section className="min-w-[300px] grid place-items-center">
      <div className="flex flex-col gap-4">
        <Heading as="h1">TLDRify this page</Heading>
        <Button onClick={summarise}>Toggle zen view</Button>
        {content.length ? (
          <div
            className={`prose max-w-none w-full overflow-auto ${styles.zen}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <Text role="alert">Could not toggle zen mode</Text>
        )}
      </div>
    </section>
  );

  async function summarise() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: () => document.documentElement.outerHTML,
      },
      async ([result]) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result.result!, "text/html");
        const reader = new Readability(doc);
        const article = reader.parse();
        setContent(article!.content);

        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: (content) => {
            console.log(content);
          },
          args: [article?.textContent],
        });
      }
    );
  }
}

export default App;

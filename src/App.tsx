import { useRef } from "react";
import { Heading, Text } from "@radix-ui/themes";

function App() {
  const inputColorRef = useRef<HTMLInputElement>(null);

  return (
    <section className="min-w-[300px] grid place-items-center">
      <div className="flex flex-col gap-4">
        <Heading as="h1">TLDRify this page</Heading>
        <form
          onSubmit={(e) => e.preventDefault()}
          onChange={summarise}
          className="flex flex-col gap-4 items-center"
        >
          <Text className="flex gap-1" as="label" htmlFor="color">
            <span>BG color</span>
            <input ref={inputColorRef} name="color" id="color" type="color" />
          </Text>
        </form>
      </div>
    </section>
  );

  async function summarise() {
    const [tab] = await chrome.tabs.query({ active: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [inputColorRef.current!.value],
      func: (color) => {
        document.body.style.backgroundColor = color;
      },
    });
  }
}

export default App;

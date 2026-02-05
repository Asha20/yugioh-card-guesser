import { createEffect, createSignal, Show } from "solid-js";
import "./App.css";
import { makePersisted } from "@solid-primitives/storage";

const [ids, setIds] = makePersisted(createSignal<number[]>([]), {
  name: "ids",
  storage: sessionStorage,
});

function hash() {
  return location.hash.slice(1);
}

const [id, setId] = createSignal(hash() ? +hash() : null);

function useRandomCard() {
  const randomIndex = Math.floor(Math.random() * ids().length);
  setId(ids()[randomIndex]);
}

createEffect(() => {
  window.addEventListener("hashchange", () => {
    if (Number(hash())) setId(Number(hash()));
  });
});

createEffect(() => {
  if (id()) {
    location.hash = id()!.toString();
  }
});

function App() {
  return (
    <>
      <Show when={ids().length && id()} fallback={<LoadList />}>
        <Game />
      </Show>
    </>
  );
}

function LoadList() {
  const onUploadList = (e: Event) => {
    const file = (e.target! as HTMLInputElement).files![0]!;
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const content = event.target!.result!;
      // 3. Split by newline (handles both Windows \r\n and Unix \n)
      const ids = (content as string)
        .split(/\r?\n/)
        .filter(x => x.trim() && !x.startsWith("#"))
        .map(x => Number(x))
        .filter(x => !Number.isNaN(x));

      setIds(ids);
      useRandomCard();
    };

    reader.onerror = () => {
      alert("Error while uploading file");
    };
    reader.readAsText(file);
  };

  return (
    <main>
      <h3>Upload newline separated list of Yugioh card IDs</h3>
      <input type="file" accept=".txt" onChange={onUploadList} />
    </main>
  );
}

function Game() {
  const [blur, setBlur] = createSignal(50);

  const next = () => {
    setBlur(50);
    useRandomCard();
  };

  return (
    <main>
      <img
        src={`https://images.ygoprodeck.com/images/cards_cropped/${id()}.jpg`}
        id="target-image"
        style={{
          filter: `blur(${blur()}px)`,
        }}
      />

      <input
        type="range"
        min="0"
        max="50"
        step="1"
        value={blur()}
        onInput={e => setBlur(+(e.target as HTMLInputElement).value)}
      />

      <a
        href={`https://images.ygoprodeck.com/images/cards/${id()}.jpg`}
        target="_blank"
      >
        Card link
      </a>

      <button onClick={next}>Next</button>
    </main>
  );
}

export default App;

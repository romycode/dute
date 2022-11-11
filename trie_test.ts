import { Trie } from "./trie.ts";
import prefixes from "./testdata/prefixes.json" assert { type: "json" };
import { PrefixNotFound } from "./trie_node.ts";
import { assertEquals, assertExists, assertThrows } from "./dev_deps.ts";

Deno.test({
  name: "Test trie - insert",
  fn: async (t) => {
    await t.step({
      name: "should insert a new prefix to the tree",
      fn: () => {
        const trie = new Trie();
        const expectedTrie = {
          prefix: "",
          children: [{ prefix: "prefix", children: [] }],
        };

        trie.add("prefix");

        assertEquals(trie.toObject(), expectedTrie, "trie not the expected");
      },
    });

    await t.step({
      name: "should insert two different prefix on the tree",
      fn: () => {
        const trie = new Trie();
        const expectedTrie = {
          prefix: "",
          children: [
            { prefix: "prefix", children: [] },
            { prefix: "suffix", children: [] },
          ],
        };

        trie.add("prefix");
        trie.add("suffix");

        assertEquals(trie.toObject(), expectedTrie, "trie not the expected");
      },
    });

    await t.step({
      name: "should split node to insert the new prefix",
      fn: () => {
        const trie = new Trie();
        const expectedTrie = {
          prefix: "",
          children: [
            {
              prefix: "pre",
              children: [
                { prefix: "fix", children: [] },
                { prefix: "load", children: [] },
              ],
            },
          ],
        };

        trie.add("prefix");
        trie.add("preload");

        assertEquals(
          trie.toObject(),
          expectedTrie,
          `Trie not the same:\nActual:\n${trie.toObject()}\nExpected:\n${expectedTrie}`,
        );
      },
    });

    await t.step({
      name: "should insert prefix that is substring of parent node",
      fn: () => {
        const trie = new Trie();
        const expectedTrie = {
          prefix: "",
          children: [
            {
              prefix: "john",
              children: [
                { prefix: "ny", children: [] },
              ],
            },
          ],
        };

        trie.add("johnny");
        trie.add("john");

        assertEquals(trie.toObject(), expectedTrie, "trie not the expected");
      },
    });

    await t.step({
      name: "should insert the same prefix one time",
      fn: () => {
        const trie = new Trie();
        const expectedTrie = {
          prefix: "",
          children: [
            {
              prefix: "prefix",
              children: [],
            },
          ],
        };

        trie.add("prefix");
        trie.add("prefix");

        assertEquals(trie.toObject(), expectedTrie, "trie not the expected");
      },
    });
  },
});

Deno.test({
  name: "Test trie - search",
  fn: async (t) => {
    const trie = new Trie();
    prefixes.forEach((p) => trie.add(p));

    await t.step({
      name: "should search for prefix",
      fn: () => {
        const found = trie.search(
          prefixes[Math.floor(Math.random() * prefixes.length)],
        );

        assertExists(found);
      },
    });

    await t.step({
      name: "should throw exception when prefix not exists",
      fn: () => {
        assertThrows(() => trie.search("notexists"), PrefixNotFound);
      },
    });
  },
});

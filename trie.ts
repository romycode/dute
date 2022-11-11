import { TrieNode } from "./trie_node.ts";

export class Trie {
  #root: TrieNode;

  constructor() {
    this.#root = new TrieNode(
      "",
      new Map<string, TrieNode>(),
    );
  }

  add(prefix: string): void {
    this.#root = this.#root.insert(prefix);
  }

  search(prefix: string): TrieNode {
    return this.#root.get(prefix);
  }

  toObject(): Record<string, unknown> {
    return this.#root.toObject();
  }

  print(): void {
    this.#root.print();
  }
}

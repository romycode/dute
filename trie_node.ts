export class PrefixNotFound extends Error {
  public name: string;

  constructor() {
    super("prefix not in the tree");

    this.name = "PrefixNotFound";
  }
}

export class TrieNode {
  readonly #prefix: string;
  readonly #children: Map<string, TrieNode>;

  constructor(prefix: string, children: Map<string, TrieNode>) {
    this.#prefix = prefix;
    this.#children = children;
  }

  insert(prefix: string): TrieNode {
    // Return current node if prefix is void
    if ("" === prefix || prefix.length === this.#prefix.length) return this;

    // Copy this to variable to work with
    let currentNode = new TrieNode(this.#prefix, this.#children);

    // Get common prefix length
    const commonPrefixLength = currentNode.#getCommonPrefixLength(prefix);

    // If common prefix length is less than node prefix
    // then we need to split the current node
    if (
      commonPrefixLength !== 0 &&
      commonPrefixLength < currentNode.#prefix.length
    ) {
      // Save current node
      const oldCurrentNode = currentNode;
      let oldChilds = new Map<string, TrieNode>();
      // Create new node
      currentNode = new TrieNode(
        oldCurrentNode.#prefix.slice(0, commonPrefixLength),
        new Map<string, TrieNode>(),
      );
      // Insert remaining old current prefix into new node
      if (0 !== oldCurrentNode.#children.size) {
        oldChilds = oldCurrentNode.#children;
      }
      currentNode.#insertNode(
        new TrieNode(
          oldCurrentNode.#prefix.slice(commonPrefixLength),
          oldChilds,
        ),
      );
      // Insert remaining of the given prefix into new node
      if (0 !== prefix.slice(commonPrefixLength).length) {
        currentNode.#insertNode(
          new TrieNode(
            prefix.slice(commonPrefixLength),
            new Map<string, TrieNode>(),
          ),
        );
      }

      return currentNode;
    }

    // If any child has prefix first char as connection add the prefix to its node
    if (currentNode.#children.has(prefix[commonPrefixLength])) {
      const existentNode = currentNode.#children.get(
        prefix[commonPrefixLength],
      ) as TrieNode;

      currentNode.#children.set(
        prefix[commonPrefixLength],
        existentNode.insert(prefix.slice(commonPrefixLength)),
      );

      return currentNode;
    }

    if (0 < prefix.length) {
      currentNode.#children.set(
        prefix[commonPrefixLength],
        new TrieNode(
          prefix.slice(commonPrefixLength),
          new Map<string, TrieNode>(),
        ),
      );
    }

    return currentNode;
  }

  /** @throws PrefixNotFound */
  get(prefix: string): TrieNode {
    // Get common prefix length
    const commonPrefixLength = this.#getCommonPrefixLength(prefix);
    prefix = prefix.slice(commonPrefixLength);

    if (0 === prefix.length) return this;

    for (let i = 0; i < prefix.length; i++) {
      if (this.#children.has(prefix[0])) {
        const node = this.#children.get(prefix[0]) as TrieNode;
        return node.get(prefix);
      }
    }

    throw new PrefixNotFound();
  }

  #insertNode(node: TrieNode): void {
    this.#children.set(node.#prefix[0], node);
  }

  #getCommonPrefixLength(prefix: string): number {
    let commonPrefixLength = 0;
    while (
      commonPrefixLength < Math.min(prefix.length, this.#prefix.length) &&
      prefix[commonPrefixLength] === this.#prefix[commonPrefixLength]
    ) {
      commonPrefixLength += 1;
    }
    return commonPrefixLength;
  }

  toObject(): Record<string, unknown> {
    return {
      prefix: this.#prefix,
      children: Array.from(this.#children.values()).map((
        n: TrieNode,
      ) => n.toObject()),
    };
  }

  print(): void {
    console.info(JSON.stringify(this.toObject(), null, 2));
  }
}

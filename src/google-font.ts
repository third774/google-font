export class GoogleFont extends HTMLElement {
  // attributes to observe
  static get observedAttributes() {
    return ["family", "weight", "style", "display"];
  }

  // attribute change callback
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.insertLinkTag();
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          font-family: ${this.getAttribute("family") ?? "Inter"};
        }
      </style>
      <slot></slot>
    `;

    this.shadowRoot!.innerHTML = "";
    // append template content to shadow DOM
    this.shadowRoot!.appendChild(template.content.cloneNode(true));
  }

  constructor() {
    super();
    // attach shadow root
    this.attachShadow({ mode: "open" });
    this.render();
  }

  get href() {
    const family = (this.getAttribute("family") ?? "Inter").replace(/ /g, "+");
    const weight = this.getAttribute("weight") ?? "400";
    const weights = weight
      .split(",")
      .filter(Boolean)
      .map((w) => w.trim());
    // might be null, normal, italic, oblique
    // we should assume normal if null
    const style = this.getAttribute("style") ?? "normal";
    const display = this.getAttribute("display") ?? "fallback";
    const styles = style
      .split(",")
      .filter(Boolean)
      .map((s) => s.trim());

    const afterAtSymbol = weights
      .map((w) =>
        styles.map((style) => {
          if (styles.length === 1 && style === "normal") {
            return w;
          }
          if (style === "normal") {
            return `0,${w}`;
          }
          if (style === "italic") {
            return `1,${w}`;
          }
          if (style === "oblique") {
            return `1,${w}`;
          }
          return `0,${w}`;
        })
      )
      .join(";");

    const beforeAtSymbol = `${family}:${[
      styles.includes("italic") && "ital",
      "wght",
    ]
      .filter(Boolean)
      .join(",")}`;

    // Asap:ital,wght@0,400;0,700;1,400;1,700

    return `https://fonts.googleapis.com/css2?family=${beforeAtSymbol}@${afterAtSymbol}&display=${display}`;
  }

  insertLinkTag() {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", this.href);
    document.head.appendChild(link);
  }
}

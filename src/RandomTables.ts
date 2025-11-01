import { html, css, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

const origin = "http://localhost:5000"

export class RandomTables extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 0px;
      color: var(--random-tables-text-color, #000);
    }
  `;

  @property({ type: Array, attribute: "random-table-names" }) randomTableNames: Array<string> = [];
  @property({ type: Array }) randomTableItems: Array<string> = [];

  constructor() {
        super();

        this.randomTableNames = [];
        this.fetchRandomTableNames();
    }

  async fetchRandomTableNames(){
        let result = await fetch(`${origin}/api/tools/random-tables/names`
          ,{ method: 'get', mode: 'cors'}
        ).then(res => res.json());
        this.randomTableNames = result.names
  }

  async fetchRandomTableItem(name: string) {
        let item = await fetch(`${origin}/api/tools/random-tables/${name}`
          ,{ method: 'get', mode: 'cors'}
        ).then(res => res.json());
        this.randomTableItems.push(item.result)
        let parenthesesItem = item.result.match(/\([^)]*\)/g)
        if (parenthesesItem) {
          parenthesesItem = parenthesesItem.toString().replace(")","").replace("(","")
          this.fetchRandomTableItem(parenthesesItem)
        }
        this.requestUpdate()
  }

  render() {
    const tableNames = [];
    for (const i of this.randomTableNames) {
      tableNames.push(html`
          <button @click=${() => this.fetchRandomTableItem(i)}>${i}</button>
        `);
    }

    return html`
      <h2>Random Table Master Panel</h2>
      <ul>${tableNames}</ul>
      <p>${this.randomTableItems.join(' | ')}</p>
    `;
  }
  
}

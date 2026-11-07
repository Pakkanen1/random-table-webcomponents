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
    button {
      background-color: #655bff;
      border-radius: 5px;
      border: none;
      color: white;
      padding: 0.3em;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      font-weight: bold;
    }
    ul {
      font-family: Tahoma, Verdana, Arial, sans-serif;
      font-weight: bold;
    }
    .table-items {
      display: flex;
      flex-wrap: wrap;
      list-style-type: none;
    }
    .table-items li {
      margin: 0.2em;
      padding: 0.2em;
      background-color: #fff;
      border: 1px solid #000;
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

  removeRandomTableItem(index: number) {
    this.randomTableItems = this.randomTableItems.filter((_, itemIndex) => itemIndex !== index);
  }

  render() {
    const tableNames = [];
    for (const i of this.randomTableNames) {
      tableNames.push(html`
          <button @click=${() => this.fetchRandomTableItem(i)}>${i}</button>
        `);
    }
    const tableItems = this.randomTableItems.map((item, index) => html`
      <li @click=${() => this.removeRandomTableItem(index)}>${item}</li>
    `);

    return html`
      <h2>Random Table Master Panel</h2>
      <ul class="table-names">${tableNames}</ul>
      <ul class="table-items">${tableItems}</ul>
    `;
  }
  
}

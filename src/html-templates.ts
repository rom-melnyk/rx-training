import { html, TemplateResult } from "lit-html";
import { GitUser } from "./git-user";


export function rowTemplate(user: GitUser): TemplateResult {
  return html`
    <div class="row">
      <img src="${user.avatar_url}" alt="${user.login}">
      <span class="name">${user.login}</span>
      <a href="javascript://" class="delete">x</a>
    </div>`;
}

export function allRowsTemplate (users: GitUser[]):TemplateResult {
  return html`
    ${users.map(u => rowTemplate(u))}`;
}

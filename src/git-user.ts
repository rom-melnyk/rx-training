export interface GitUser {
  // Git API data
  avatar_url: string,
  login: string,
  html_url: string,

  // is not provided by API
  is_hidden: boolean,
}

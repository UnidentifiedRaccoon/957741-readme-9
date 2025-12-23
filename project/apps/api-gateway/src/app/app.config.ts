export enum ApplicationServiceURL {
  Users = 'http://localhost:3001/api/auth',
  Content = 'http://localhost:3002/api/posts',
  Engage = 'http://localhost:3003/api',
  Notify = 'http://localhost:3004/api',
  Storage = 'http://localhost:3005/api/files',
}

export const HTTP_CLIENT_MAX_REDIRECTS = 5;
export const HTTP_CLIENT_TIMEOUT = 5000;

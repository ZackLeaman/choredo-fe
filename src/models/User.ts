export interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  identities: {
    identity_id: string;
    id: string;
    user_id: string;
    provider: string;
    email: string;
    identity_data: {
      sub: string;
      email: string;
    };
  }[];
}

Create Azure AD app reg with CLI for Microsoft 365:

```sh
m365 aad app add --name 'Angular JumpStart' --platform spa --redirectUris 'http://localhost' --apisDelegated 'https://graph.microsoft.com/User.Read' --save
```

References:

- https://www.npmjs.com/package/@azure/msal-angular
  auth package for Angular
- a
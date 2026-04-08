# Fullstack Todo App

How to run the app locally

## Run App

Run client:

```bash
npm run client
```

Run backend:

```bash
nodemon -e ts --exec tsx server/server.ts
```

Run both client and backend:

```bash
npm run dev
```

## Environmental Variables

Steps to set up environmental variables

1. Login at https://console.cloud.google.com/auth/clients

2. Create a new client and select Web Application for application type

3. Add the following URLs to Authorized JavaScript Origins

    - https://localhost
    - https://localhost:3000
    - https://localhost:8080

4. Add the following URLs to Authorized redirect URIs

    - https://localhost:3000/login
    - https://localhost:3000/oauth2/redirect/google
    - https://localhost:3000/dashboard
    - https://localhost:8080/api/auth/google/callback

5. Press "Create" and save the client ID and client secret

6. On the local project, add a .env file

7. Add the environmental variables:

```bash
CLIENT_ID="YOUR_CLIENT_ID"
CLIENT_SECRET="YOUR_CLIENT_SECRET"
```

## Testing

Run tests:

```bash
npm run test
```

## Demo User

Add demo user:

```bash
npm run seed
```

Credentials:

* Email: email@email.com

* Password: password9
# Privy PII Demo

This [next.js](https://nextjs.org) app is a demo of integrating Privy for basic user PII.

This demo is intended to serve as a basic example for how to integrate [privy-js](https://www.npmjs.com/package/privy-js) in the browser. In particular, see
- [index.tsx](https://github.com/horkos-labs/privy-pii-demo/tree/main/pages/users/%5Bid%5D/index.tsx) for an example of how to fetch user data with Privy
- [edit.tsx](https://github.com/horkos-labs/privy-pii-demo/blob/main/pages/users/%5Bid%5D/edit.tsx) for an example on how to save user data with Privy.

All user data (form fields, file uploads) in this demo are end-to-end encrypted using keys managed on your behalf by the Privy kms.

![demo](demo.gif)

## Setup

#### Install from source

```
git clone <repo>
cd <repo>
npm install
```

#### Set up your API keys

- Copy `.env.example.local` to `.env.local`.
- Update the variables in `.env.local` with your Privy API key and secret from the Privy console.

#### Start the server.

```
npm run dev
```

#### Enjoy

Point your browser to `localhost:3005`

Sleep at night as you integrate user data in your product while handling it securely! 🛌😴🌴🍹

As always, reach out to support@privy.io with any and all questions or comments. We love your feedback!

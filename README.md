# Privy PII Demo

This [next.js](https://nextjs.org) app is a demo of integrating Privy using Sign-In With Ethereum for user PII data.

This demo is intended to serve as a basic example for how to integrate [privy-js](https://www.npmjs.com/package/@privy-io/privy-js) in the browser.

You can imagine this app as a user logging in to something like a "profile" or "settings" page to store some personal information that your app could later access to understand who your users are (beyond wallet addresses).

All user data (form fields, file uploads) in this demo are end-to-end encrypted using keys managed on your behalf by the Privy kms.

## Implementation

There are a couple interesting implementation pieces to point out. Most notably, check out the [components/session.tsx](https://github.com/privy-io/privy-pii-demo/blob/main/components/session.tsx) file. In there, you'll find an object that wraps Privy's `SiweSession` object with some useful helpers and is exposed via a React hook so that components can easily make use of it. This object handles authenticating users to Privy as well as signing them out.

Beyond that, check out [pages/index.tsx](https://github.com/privy-io/privy-pii-demo/blob/main/pages/index.tsx) and [pages/edit.tsx](https://github.com/privy-io/privy-pii-demo/blob/main/pages/edit.tsx). The index page displays the user profile information (READ calls to Privy) while the edit page handles updating the user's profile information (WRITE calls to Privy).

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

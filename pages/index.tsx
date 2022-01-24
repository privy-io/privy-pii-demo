import React from "react";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

function Home() {
  const router = useRouter();

  const [requesterId, setRequesterId] = useState("");
  const [userId, setUserId] = useState("");
  const [roles, setRoles] = useState("");

  function onSubmit(action: "edit" | "show") {
    const reqRequesterId = requesterId.trim();
    const reqUserId = userId.trim() || reqRequesterId;

    if (requesterId.length === 0) {
      return false;
    }

    const queryParams = {
      roles: encodeURIComponent(roles).replace("%2C", ","),
      requester_id: encodeURIComponent(requesterId),
    };

    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    switch (action) {
      case "show":
        router.push(`/users/${reqUserId}?${queryString}`);
        return;
      case "edit":
        router.push(`/users/${reqUserId}/edit?${queryString}`);
        return;
      default:
        throw new Error("invalid action");
    }
  }

  return (
    <div>
      <Head>
        <title>Privy Demo</title>
      </Head>
      <main>
        <header>
          <h1>Privy Demo</h1>
          <nav>
            <a href="/">Home</a>
          </nav>
        </header>

        <div className="page-header">
          <Image
            src="/privy-logo.png"
            alt="Vercel Logo"
            width={48}
            height={48}
          />
          <h2 className="title">Privy Demo</h2>
        </div>
        <div className="privy-field-group">
          <div className="privy-field">
            <label htmlFor="requester-id">
              Enter requester ID to impersonate
            </label>
            <input
              className="input is-normal"
              type="text"
              id="requester-id"
              name="requester-id"
              placeholder="0x123abc"
              value={requesterId}
              required
              onChange={(e) => setRequesterId(e.target.value)}
            />
          </div>
          <div className="privy-field">
            <label htmlFor="user-id">
              Enter user ID (defaults to requester ID)
            </label>
            <input
              className="input is-normal"
              type="text"
              id="user-id"
              name="user-id"
              placeholder="0x123abc"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>

        <div className="privy-field-group">
          <div className="privy-field">
            <label htmlFor="roles">
              Enter comma-separated roles (optional)
            </label>
            <input
              className="input is-normal"
              type="text"
              id="roles"
              name="roles"
              placeholder="foo,bar"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
            />
          </div>
        </div>

        <div className="privy-field-group-full">
          <button
            className={
              requesterId.trim().length > 0 ? "button is-primary" : "button"
            }
            style={{ marginRight: "8px" }}
            id="edit"
            disabled={requesterId.trim().length <= 0}
            onClick={(e) => {
              e.preventDefault();
              onSubmit("edit");
            }}
          >
            Edit user
          </button>

          <button
            className={
              requesterId.trim().length > 0 ? "button is-primary" : "button"
            }
            id="show"
            disabled={requesterId.trim().length <= 0}
            onClick={(e) => {
              e.preventDefault();
              onSubmit("show");
            }}
          >
            Show user
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { formatDisplayAddress, UserData } from "../shared";
import { FieldInstance } from "@privy-io/privy-browser";
import { useSession, SignOutLink } from "../components/session";
import avatarPlaceholder from "../public/avatar_placeholder.png";

function UserShowPage() {
  const session = useSession();

  const [userData, setUserData] = useState<Omit<UserData, "avatar">>({
    name: null,
    username: null,
    email: null,
    website: null,
    bio: null,
  });

  const [avatar, setAvatar] = useState<FieldInstance | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  // Fetch user PII from privy on component mount
  useEffect(() => {
    async function fetchDataFromPrivy() {
      try {
        const [name, username, email, website, bio] = await session.privy.get(
          session.address,
          ["name", "username", "email", "website", "bio"]
        );

        setUserData({
          name,
          username,
          email,
          website,
          bio,
        });

        const avatar = await session.privy.getFile(session.address, "avatar");
        setAvatar(avatar);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDataFromPrivy();
  }, [session]);

  // Construct the avatar url when the avatar value changes
  useEffect(() => {
    if (!avatar) {
      return;
    }

    const src = URL.createObjectURL(avatar.blob());
    setAvatarSrc(src);

    // Cleanup image url after use
    return () => URL.revokeObjectURL(src);
  }, [avatar]);

  return (
    <UserShow
      address={session.address}
      userData={userData}
      avatarSrc={avatarSrc}
    />
  );
}

function UserShow(props: {
  address: string;
  userData: Omit<UserData, "avatar">;
  avatarSrc: string | null;
}) {
  const router = useRouter();

  const { name, username, email, website, bio } = props.userData;

  return (
    <div>
      <Head>
        <title>Privy Demo - User {props.address}</title>
        <meta name="description" content="Privy user profile demo" />
      </Head>

      <main>
        <header>
          <h1>Privy Demo</h1>
          <nav>
            <Link href="/">Home</Link>
            <SignOutLink />
            <Link href="https://github.com/privy-io/privy-pii-demo">
              View on Github
            </Link>
          </nav>
        </header>

        <div className="page-header">
          <div className="avatar">
            {props.avatarSrc != null ? (
              <Image
                src={props.avatarSrc}
                alt="User avatar"
                width={100}
                height={100}
              />
            ) : (
              <Image
                src={avatarPlaceholder}
                alt="Avatar placeholder"
                width={100}
                height={100}
                quality={90}
              />
            )}
          </div>
          <h2 className="title">User {formatDisplayAddress(props.address)}</h2>
        </div>

        <div>
          <div className="privy-field-group">
            <div className="privy-field">
              <strong>Name</strong>
              <p>{name ? name.text() : "N/A"}</p>
            </div>
            <div className="privy-field">
              <strong>Username</strong>
              <p>{username ? username.text() : "N/A"}</p>
            </div>
          </div>

          <div className="privy-field-group">
            <div className="privy-field">
              <strong>Email</strong>
              <p>{email ? email.text() : "N/A"}</p>
            </div>
            <div className="privy-field">
              <strong>Website</strong>
              <p>{website ? website.text() : "N/A"}</p>
            </div>
          </div>

          <div className="privy-field-group">
            <div className="privy-field-full">
              <strong>Bio</strong>
              <p>{bio ? bio.text() : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="privy-field-group">
          <button
            className="button"
            onClick={(e) => {
              e.preventDefault();
              router.push("/edit");
            }}
          >
            Edit
          </button>
        </div>
      </main>
    </div>
  );
}

export default UserShowPage;

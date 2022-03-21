import React, { useEffect, useState } from "react";
import Link from 'next/link'
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { buildClient } from "../../../privy-client";
import { formatUserData, UserData, UserDataResponse } from "../../../shared";
import { UserData as PrivyUserData, PrivyError } from "privy-js";

type PropsType = {
  userId: string;
  roles: string;
  requesterId: string;
};

function UserShowState(props: PropsType) {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    wallets: "",
    avatar: "",
  });

  const [avatar, setAvatar] = useState<Blob | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  function updateUserData(data: Partial<UserData>) {
    setUserData({ ...userData, ...data });
  }

  // Fetch user PII from privy on component mount
  useEffect(() => {
    // For the purpose of this demo, clients tell the server who the requester
    // is and what roles they have. However, in real-world settings, the server
    // would assign permissions / roles appropriately based on the currently
    // logged in user and what access they should have.
    const privy = buildClient(props.requesterId, props.roles);

    const onFetchDataSuccess = async (userDataResponse: PrivyUserData[]) => {
      const userData = formatUserData(userDataResponse as UserDataResponse[]);

      updateUserData(userData);

      // Download and decrypt the avatar image contents
      try {
        // userData.avatar is the file id of the uploaded avatar
        const avatarFileId = userData.avatar;
        const blob = await privy.download(props.userId, "avatar", avatarFileId);
        setAvatar(blob);
      } catch (e) {
        console.log(e);
      }
    };

    const onFetchDataFailure = (error: PrivyError) => {
      console.log(error);
    };

    privy.fetchData(props.userId).then(onFetchDataSuccess, onFetchDataFailure);
  }, []);

  // Construct the avatar url when the avatar value changes
  useEffect(() => {
    if (!avatar) {
      return;
    }

    const src = URL.createObjectURL(avatar);
    setAvatarSrc(src);

    // Cleanup image url after use
    return () => URL.revokeObjectURL(src);
  }, [avatar]);

  return (
    <UserShow userId={props.userId} userData={userData} avatarSrc={avatarSrc} />
  );
}

function UserShow(props: {
  userId: string;
  userData: UserData;
  avatarSrc: string | null;
}) {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Privy Demo - User {props.userId}</title>
        <meta name="description" content="Privy demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <header>
          <h1>Privy Demo</h1>
          <nav>
            <Link href="/">Home</Link>
          </nav>
        </header>

        <div className="page-header">
          <div className="avatar">
            {props.avatarSrc != null ? (
              <img src={props.avatarSrc} />
            ) : (
              <Image
                src="/avatar_placeholder.png"
                alt="Avatar"
                width={100}
                height={100}
              />
            )}
          </div>
          <h2 className="title">User {props.userId}</h2>
        </div>

        <div>
          <div className="privy-field-group">
            <div className="privy-field">
              <strong>Full Name</strong>
              <p>{props.userData.fullName}</p>
            </div>
            <div className="privy-field">
              <strong>Wallets</strong>
              <p>{props.userData.wallets}</p>
            </div>
          </div>
        </div>

        <div className="privy-field-group">
          <button
            className="button"
            onClick={(e) => {
              e.preventDefault();
              router.push(
                `/users/${props.userId}/edit${window.location.search}`
              );
            }}
          >
            Edit
          </button>
        </div>
      </main>
    </div>
  );
}

function UserShowPage(props: any) {
  const router = useRouter();
  const id = router.query.id;
  if (typeof id === "string") {
    return (
      <UserShowState
        {...props}
        userId={id}
        requesterId={router.query.requester_id}
        roles={router.query.roles}
      />
    );
  } else {
    return null;
  }
}

export default UserShowPage;

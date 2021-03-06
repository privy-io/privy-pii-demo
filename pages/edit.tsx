import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { formatUserData, formatDisplayAddress, UserDataInput } from "../shared";
import { useSession, SignOutLink } from "../components/session";
import privyLogo from '../public/privy-logo.png'

const isBlank = (s: string | null | void) => s != null && s.trim() === "";
const isPresent = (s: string | null | void) => !isBlank(s);

function EditUserPage() {
  const session = useSession();
  const router = useRouter();

  const [userData, setUserData] = useState<UserDataInput>({
    name: "",
    username: "",
    email: "",
    website: "",
    bio: "",
    avatar: "",
  });

  function submitEnabled() {
    return Object.values(userData).every(isPresent);
  }

  function updateUserData(data: Partial<UserDataInput>) {
    setUserData({ ...userData, ...data });
  }

  // Instantiate client and fetch user data on page load
  useEffect(() => {
    async function fetchDataFromPrivy() {
      try {
        const response = await session.privy.get(session.address, [
          "name",
          "username",
          "email",
          "website",
          "bio",
          "avatar",
        ]);
        updateUserData(formatUserData(response));
      } catch (error) {
        console.log(error);
      }
    }

    fetchDataFromPrivy();
  }, [session]);

  async function saveUserData() {
    try {
      await session.privy.put(session.address, [
        {
          field: "name",
          value: userData.name,
        },
        {
          field: "username",
          value: userData.username,
        },
        {
          field: "email",
          value: userData.email,
        },
        {
          field: "website",
          value: userData.website,
        },
        {
          field: "bio",
          value: userData.bio,
        },
      ]);

      router.push("/");
    } catch (e) {
      console.log(e);
    }
  }

  async function uploadAvatar(file: File) {
    try {
      const avatar = await session.privy.putFile(
        session.address,
        "avatar",
        file
      );
      const avatarFileId = avatar.value;
      updateUserData({ avatar: avatarFileId });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <EditUser
      address={session.address}
      userData={userData}
      onUpdate={updateUserData}
      onAvatarUpdate={uploadAvatar}
      submitEnabled={submitEnabled()}
      onSubmit={saveUserData}
    />
  );
}

function EditUser(props: {
  address: string;
  userData: UserDataInput;
  onUpdate: (state: Partial<UserDataInput>) => void;
  onAvatarUpdate: (avatar: File) => void;
  submitEnabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <div>
      <Head>
        <title>Privy Demo - User Profile</title>
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
          <Image
            src={privyLogo}
            alt="Privy logo"
            width={48}
            height={48}
            quality={90}
          />
          <h2 className="title">{formatDisplayAddress(props.address)}</h2>
        </div>

        <div>
          <div className="privy-field-group">
            <div className="privy-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="input is-normal"
                placeholder="Jane doe"
                autoComplete="off"
                value={props.userData.name}
                onChange={(e) => props.onUpdate({ name: e.target.value })}
              />
            </div>
            <div className="privy-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="input is-normal"
                placeholder="janedoe"
                autoComplete="off"
                value={props.userData.username}
                onChange={(e) => props.onUpdate({ username: e.target.value })}
              />
            </div>
          </div>

          <div className="privy-field-group">
            <div className="privy-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                className="input is-normal"
                placeholder="jane@doe.com"
                autoComplete="off"
                value={props.userData.email}
                onChange={(e) => props.onUpdate({ email: e.target.value })}
              />
            </div>
            <div className="privy-field">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                className="input is-normal"
                placeholder="http://example.com"
                autoComplete="off"
                value={props.userData.website}
                onChange={(e) => props.onUpdate({ website: e.target.value })}
              />
            </div>
          </div>

          <div className="privy-field-group">
            <div className="privy-field-full">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                className="textarea"
                placeholder="Tell us about yourself"
                autoComplete="off"
                value={props.userData.bio}
                onChange={(e) => props.onUpdate({ bio: e.target.value })}
              ></textarea>
            </div>
          </div>

          <FileUploadFormField onAvatarUpdate={props.onAvatarUpdate} />

          <div className="privy-field-group">
            <button
              className={props.submitEnabled ? "button is-primary" : "button"}
              id="submit"
              disabled={!props.submitEnabled}
              onClick={(e) => {
                e.preventDefault();
                props.onSubmit();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function FileUploadFormField(props: {
  onAvatarUpdate: (avatar: File) => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files || new FileList();
    const file = fileList[0] || null;
    setAvatar(file);
    if (file !== null) {
      setIsLoading(true);
      await props.onAvatarUpdate(file);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="privy-field-group">
      <div className="privy-field">
        <p>User avatar</p>
        <div className="file has-name">
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              id="avatar"
              onChange={onChange}
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">
                {avatar != null ? "File chosen" : "Choose a file???"}
              </span>
            </span>
            <span className="file-name">
              {avatar !== null ? avatar.name : "No file chosen"}
            </span>
          </label>
        </div>
        {isLoading ? (
          <div className="upload-progress">
            <progress
              className="progress is-small is-primary"
              max="100"
            ></progress>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EditUserPage;

import { useRouter } from "next/router";
import { useSession } from "../components/session";

function Home() {
  const router = useRouter();
  const session = useSession();
  session?.address().then((address) => {
    router.push(`/users/${address}`);
  });
  return null;
}

export default Home;

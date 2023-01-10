import { deleteCookie } from "cookies-next";

const createUserSession = async (token: string, signOut: Function) => {
  await fetch("/api/createUserSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });

  setTimeout(async () => {
    await signOut();
  }, 1000 * 60 * 60 * 24 * 13);
};

export default createUserSession;

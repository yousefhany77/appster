import { deleteCookie } from "cookies-next";

const createUserSession = (token: string, signOut: Function) => {
  fetch("/api/createUserSession", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: token,
    }),
  });

  setTimeout(() => {
    signOut().then(() => {
      deleteCookie("session");
      window.location.href = "/login";
    });
  }, 1000 * 60 * 60 * 24 * 13);
};

export default createUserSession;
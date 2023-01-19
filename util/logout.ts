import { clientAuth } from "../firebase";

async function logout() {
  try {
     await fetch("/api/logout");
    clientAuth.signOut();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

export default logout;


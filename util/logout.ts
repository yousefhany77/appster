import { clientAuth } from "../firebase";

async function logout() {
  try {
    await fetch("/api/logout");
    await clientAuth.signOut();
    window.location.replace("/");
  } catch (error) {
    console.log(error);
  }
}

export default logout;

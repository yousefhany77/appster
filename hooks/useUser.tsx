"use client";

import { useEffect, useState } from "react";
import { clientAuth } from "../firebase";

function useUser() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState(clientAuth.currentUser);
  useEffect(() => {
    clientAuth.onAuthStateChanged((user) => {
      if (!user) return;
      setUser(user);
      const getUserRole = async () => {
        const res = await fetch("/api/validateUserRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: await user.getIdToken(true) }),
        });
        const data = await res.json();
        setUserRole(data.role);
      };
    });
  }, []);
  return { user, userRole };
}

export default useUser;

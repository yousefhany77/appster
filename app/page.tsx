"use client";

import {
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { clientAuth, db } from "../firebase";
import logout from "../util/logout";

function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState(clientAuth.currentUser);
  useEffect(() => {
    const getData = async () => {
      const q = query(
        collection(db, "job_postings"),
        where("jobTitle", "in", [
          "Frontend developer",
          "Full Stack software engineer",
        ])
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    };
    clientAuth.onAuthStateChanged((user) => {
      setUser(user);
    });
    getData();
  }, []);
  if (user) {
    return (
      <div>
        <h1>Home</h1>
        <p>Logged in as {user.email}</p>
        <p>{userRole}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            const res = await fetch("/api/validateUserRole", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: await user.getIdToken(true) }),
            });
            console.log(res);
            const data = await res.json();
            setUserRole(data.role);
          }}
        >
          userRole
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={logout}
        >
          signOut
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

export default Home;

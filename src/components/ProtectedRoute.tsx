"user client";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { type User } from "firebase/auth";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebaseConfig";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      if (currentUser === null) {
        router.replace("/login");
      }
    });
    return unsuscribe();
  }, [router]);

  if (user === undefined) {
    return <p role="status"> Comprobando sesión...</p>;
  }

  if (user === null) {
    return <p role="status"> Redirigiendo al login...</p>;
  }

  return <>{children}</>;
}

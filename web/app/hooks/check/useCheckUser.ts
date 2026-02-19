"use client";
import { useState, useEffect } from "react";
import config from "@/app/config-api.json";

type CheckData = {
  logged: boolean;
  isAdmin: boolean;
  checking: boolean;
}

class CheckError extends Error {
  where: "LOGGED" | "ADMIN";

  constructor(error: string, where: "LOGGED" | "ADMIN") {
    super(error);
    this.where = where;
  }
}

export function useCheckUser() {
  const [auth, setAuth] = useState<CheckData>({ logged: false, isAdmin: false, checking: true });

  useEffect(() => {
    async function check() {
      let logged = false;
      let isAdmin = false;

      try {
        const res = await fetch(`${config.api_url}/auth/check`, {
          credentials: "include"
        }).then(res => res.json());

        if (!res.success) throw new CheckError(res.message, "LOGGED");

        logged = true;

        const adminRes = await fetch(`${config.api_url}/auth/check/admin`, {
          credentials: "include"
        }).then(res => res.json());

        if (!adminRes.success) throw new CheckError(adminRes.message, "ADMIN");

        isAdmin = true;

      } catch (err: unknown) {
        if (err instanceof CheckError) {
          if (err.where === "LOGGED") {
            logged = false;
            isAdmin = false;
          }

          if (err.where === "ADMIN" ) {
            isAdmin = false;
          }
        }

      } finally {
        setAuth({
          logged,
          isAdmin,
          checking: false
        });
      }
    }

    check();
  }, []);

  return {
    logged: auth.logged,
    isAdmin: auth.isAdmin,
    checking: auth.checking
  };
}
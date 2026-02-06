"use client";
import { useEffect, useState } from "react";

export function useGetElements<T>(endpoint: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    async function fecthElements() {
      try {
        setLoading(true);

        const res = await fetch(endpoint).then(res => res.json());

        if (!res.success) throw new Error(res.message);

        setData(res.data);

      } catch (err) {
        console.error(err);
        
      } finally {
        setLoading(false);
      }
    }

    fecthElements();
  }, [endpoint]);

  return { loading, data };
}
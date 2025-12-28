"use client";
import { useEffect, useState } from "react";
import config from "@/app/config-api.json";

export function useGetElements<T>(actualSection: string) {
  const [elements, setElements] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  async function getElements() {
    setLoading(true);
    try {
      const result = await fetch(
        `${config.api_url}/${actualSection}`
      ).then(res => res.json());

      setElements(result.data);

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);

    }
  }

  useEffect(() => {
    getElements();
  }, [actualSection]);

  return {
    elements,
    refetch: getElements,
    loading
  };
}
"use client";
import { useEffect, useState, useCallback } from "react";
import config from "@/app/config-api.json";

export function useGetElements<T>(actualSection: string) {
  const [elements, setElements] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const getElements = useCallback(async () => {
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
  }, [actualSection]);

  useEffect(() => {
    getElements();
  }, [getElements]);

  return {
    elements,
    refetch: getElements,
    loading
  };
}
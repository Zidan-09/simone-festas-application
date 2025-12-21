import { useState, useEffect } from "react";
import config from "@/app/config.json";
import { ThemeCategory } from "@/app/lib/utils/theme/themeCategory";

export type Theme = {
  id: string,
  name: string,
  mainImage: string,
  type: ThemeCategory
}

export function useThemes() {
  const [data, setData] = useState({
    kids: [] as Theme[],
    adults: [] as Theme[],
    specialEvents: [] as Theme[],
    holidays: [] as Theme[],
    loading: true,
  });

  useEffect(() => {
    async function fetchAllThemes() {
      try {
        const [kids, adults, specialEvents, holidays] = await Promise.all([
          fetch(`${config.api_url}/${ThemeCategory.KIDS}`).then(res => res.json()),
          fetch(`${config.api_url}/${ThemeCategory.ADULTS}`).then(res => res.json()),
          fetch(`${config.api_url}/${ThemeCategory.SPECIAL_EVENTS}`).then(res => res.json()),
          fetch(`${config.api_url}/${ThemeCategory.HOLIDAYS}`).then(res => res.json()),
        ]);

        setData({
          kids,
          adults,
          specialEvents,
          holidays,
          loading: false
        })
      } catch (err) {
        console.error(err);
        setData(prev => ({...prev, loading: false}));
      }
    };

    fetchAllThemes();
  }, []);

  return data;
}
import { useState, useEffect } from "react";
import { ThemeCategory } from "@prisma/client";
import config from "@/app/config-api.json";

type Images = {
    id: string;
    themeId: string;
    url: string;
};

export type Theme = {
  id: string;
  name: string;
  mainImage: string;
  category: ThemeCategory;
  images: Images[];
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
          fetch(`${config.api_url}/theme/category/${ThemeCategory.KIDS}`).then(res => res.json()),
          fetch(`${config.api_url}/theme/category/${ThemeCategory.ADULTS}`).then(res => res.json()),
          fetch(`${config.api_url}/theme/category/${ThemeCategory.SPECIAL_EVENTS}`).then(res => res.json()),
          fetch(`${config.api_url}/theme/category/${ThemeCategory.HOLIDAYS}`).then(res => res.json()),
        ]);

        setData({
          kids: kids.data,
          adults: adults.data,
          specialEvents: specialEvents.data,
          holidays: holidays.data,
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
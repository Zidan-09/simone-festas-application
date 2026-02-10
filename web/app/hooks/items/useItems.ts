import { useState, useEffect } from "react";
import type { ItemFormated } from "@/app/types";
import { ItemType } from "@/app/types";
import config from "@/app/config-api.json";

export function useItems() {
  const [data, setData] = useState({
    panels: [] as ItemFormated[],
    curtain: [] as ItemFormated[],
    table: [] as ItemFormated[],
    dessert_stand: [] as ItemFormated[],
    loading: true,
  });

  useEffect(() => {
    async function fetchAllItems() {
      try {
        const [panels, curtain, table, dessert_stand] = await Promise.all([
          fetch(`${config.api_url}/item/type/${ItemType.PANEL}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemType.CURTAIN}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemType.TABLE}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemType.DESSERT_STAND}`).then(res => res.json()),
        ]);

        setData({
          panels: panels.data,
          curtain: curtain.data,
          table: table.data,
          dessert_stand: dessert_stand.data,
          loading: false
        })
      } catch (err) {
        console.error(err);
        setData(prev => ({...prev, loading: false}));
      }
    };

    fetchAllItems();
  }, []);

  return data;
}
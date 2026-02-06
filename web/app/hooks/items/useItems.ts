import { useState, useEffect } from "react";
import config from "@/app/config-api.json";
import { ItemTypes } from "@/app/lib/utils/item/itemTypes";

export type Item = {
  id: string,
  name: string,
  description: string,
  price: number,
  variant: string,
  image: string;
  type: ItemTypes
}

export function useItems() {
  const [data, setData] = useState({
    panels: [] as Item[],
    curtain: [] as Item[],
    table: [] as Item[],
    dessert_stand: [] as Item[],
    loading: true,
  });

  useEffect(() => {
    async function fetchAllItems() {
      try {
        const [panels, curtain, table, dessert_stand] = await Promise.all([
          fetch(`${config.api_url}/item/type/${ItemTypes.PANEL}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemTypes.CURTAIN}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemTypes.TABLE}`).then(res => res.json()),
          fetch(`${config.api_url}/item/type/${ItemTypes.DESSERT_STAND}`).then(res => res.json()),
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
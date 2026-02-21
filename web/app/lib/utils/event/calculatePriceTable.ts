
export function calculatePriceTable(people: number): number {
  if (people <= 10) return 250;
  if (people >= 80) return 1200;

  const priceTable = [
    { people: 10, price: 250 },
    { people: 20, price: 450 },
    { people: 30, price: 600 },
    { people: 40, price: 750 },
    { people: 50, price: 900 },
    { people: 60, price: 1000 },
    { people: 70, price: 1150 },
    { people: 80, price: 1200 },
  ];

  for (let i = 0; i < priceTable.length - 1; i++) {
    const current = priceTable[i];
    const next = priceTable[i + 1];

    if (people >= current.people && people <= next.people) {
      const proportion =
        (people - current.people) /
        (next.people - current.people);

      return Math.round(
        current.price +
        proportion * (next.price - current.price)
      );
    }
  }

  return 0;
}
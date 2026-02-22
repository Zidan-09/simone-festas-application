import Catalog from "./CatalogClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  return <Catalog query={params.q} />
}
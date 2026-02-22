import Themes from "./ThemesClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  return <Themes query={params.q} />
}
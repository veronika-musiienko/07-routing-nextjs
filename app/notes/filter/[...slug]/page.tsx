import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const paramsQuery = await params;
  const slug = paramsQuery.slug || [];
  const tag = slug[0] || "all"; // Якщо тегу немає, ставимо "all"
  const page = 1;

  const queryClient = new QueryClient();

  // 1. Попередньо завантажуємо дані в кеш на сервері
  await queryClient.prefetchQuery({
    // КЛЮЧ МАЄ ТОЧНО ЗБІГАТИСЯ з ключем у Notes.client.tsx
    queryKey: ["notes", "", tag, page], 
    queryFn: () =>
      fetchNotes({
        searchQuery: "",
        tag: tag.toLowerCase() === "all" ? undefined : tag,
        page: page,
      }),
  });

return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    {/* Додаємо key! Коли tag зміниться, React перестворить компонент з чистим стейтом */}
    <NotesClient key={tag} tag={tag} />
  </HydrationBoundary>
);
}

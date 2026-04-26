import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"; // Додали HydrationBoundary
import NoteDetailsClient from "./NoteDetails.client";

type Props = { params: Promise<{ id: string }> };

export default async function NoteDetails({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;

  // 1. Попередньо завантажуємо дані в кеш на сервері
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    // 2. Обгортаємо компонент у HydrationBoundary і передаємо стан кешу в проп state
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* 3. Тепер передаємо тільки id. Клієнт сам «підхопить» дані з HydrationBoundary */}
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
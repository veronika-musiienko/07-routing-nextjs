import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotePreviewModal from "./NotePreview.client"; // Переконайся, що ім'я файлу збігається

type Props = { params: Promise<{ id: string }> };

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewModal id={id} />
    </HydrationBoundary>
  );
}
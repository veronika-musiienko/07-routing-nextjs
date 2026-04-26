"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api";

// 1. Описуємо типи: тепер ми чекаємо тільки id
interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  // 2. Викликаємо useQuery. Він автоматично знайде дані в кеші, 
  // який ми підготували на сервері.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // Це обов'язкова вимога ментора
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>{new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

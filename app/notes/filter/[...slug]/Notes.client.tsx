"use client";

import css from "./Notes.client.module.css";
import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ToastContainer, toast } from "react-toastify"; // Додано toast
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import CreateModal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";

// Прибираємо initialData з типів, як просив ментор
type NoteClientProps = {
  tag: string;
};

export default function NotesClient({ tag }: NoteClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  // Бекенд не хоче "All", він хоче або тег, або нічого
  const queryTag = tag.toLowerCase() === "all" ? undefined : tag;

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["notes", searchQuery, tag, currentPage],
    queryFn: () =>
      fetchNotes({
        searchQuery: searchQuery,
        tag: queryTag,
        page: currentPage,
      }),
    placeholderData: keepPreviousData,
    // initialData ВИДАЛЕНО для коректної гідратації
    refetchOnMount: false, 
  });

  const totalPages = data?.totalPages || 0;
  const noNotesToastShown = useRef(false);

  // Обробка помилок
  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong while fetching notes.");
    }
  }, [isError]);

  // Обробка порожнього результату
  useEffect(() => {
    if (!isLoading && data && data.notes.length === 0 && searchQuery !== "") {
      if (!noNotesToastShown.current) {
        toast.info("No notes found for your request.");
        noNotesToastShown.current = true;
      }
    } else {
      noNotesToastShown.current = false;
    }
  }, [data, isLoading, searchQuery]);



  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleInputChange} value={inputValue} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setModalOpen(true)} className={css.button}>
          Create note +
        </button>
        {isModalOpen && (
          <CreateModal onClose={() => setModalOpen(false)}>
            <NoteForm onCancel={() => setModalOpen(false)} />
          </CreateModal>
        )}
      </header>

      {isLoading && <Loader />}
      
      {isSuccess && data?.notes?.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p className={css.empty}>No notes available.</p>
      )}

      <ToastContainer />
    </div>
  );
}
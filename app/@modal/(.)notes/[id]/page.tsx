import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client"; 

export default async function NoteModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    // Додаємо порожню функцію або логіку закриття, якщо Modal її вимагає
    <Modal onClose={() => {}}> 
      <NoteDetailsClient id={id} />
    </Modal>
  );
}
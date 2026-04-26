import css from "./Header.module.css"; 
import Link from "next/link";

export default function Header() {
  return (
    <header className={css.header}>
      {/* Логотип тепер є єдиним посиланням на головну сторінку */}
      <Link href="/" className={css.logo} aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            {}
            <Link href="/notes/filter/all" className={css.link}>
              Notes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
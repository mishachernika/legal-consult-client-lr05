import { Link } from 'react-router';
import { APP_NAME, CONTACTS, ROUTES } from '@/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4">
        <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{APP_NAME}</p>
        <p>
          Контакти:{' '}
          <a href={`mailto:${CONTACTS.email}`} className="hover:text-primary-600">
            {CONTACTS.email}
          </a>
          {' · '}
          <a href={`tel:${CONTACTS.phoneHref}`} className="hover:text-primary-600">
            {CONTACTS.phone}
          </a>
          {' · '}
          <a
            href={CONTACTS.addressUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary-600"
          >
            {CONTACTS.address}
          </a>
        </p>
        <nav className="flex gap-4">
          <Link to={ROUTES.home} className="hover:text-primary-600">
            Головна
          </Link>
          <Link to={ROUTES.about} className="hover:text-primary-600">
            Про нас
          </Link>
          <Link to={ROUTES.login} className="hover:text-primary-600">
            Увійти
          </Link>
        </nav>
        <p>
          © {new Date().getFullYear()} {APP_NAME}. Усі права захищено.
        </p>
      </div>
    </footer>
  );
}

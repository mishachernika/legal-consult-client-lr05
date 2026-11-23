import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { APP_NAME, CONTACTS } from '@/constants';

const TECH_STACK = [
  'React 19 + TypeScript',
  'Vite 8 (Rolldown)',
  'Tailwind CSS 4',
  'React Router 8',
  'Axios з інтерцепторами',
  'ESLint 10 + Prettier',
  'Backend: Node.js + Express + Prisma + PostgreSQL + Socket.io (ЛР01–ЛР03)',
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <section className="flex flex-col gap-4 text-center">
        <Badge variant="info">Про платформу</Badge>
        <h1 className="text-3xl font-bold md:text-4xl">Про {APP_NAME}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {APP_NAME} — онлайн-сервіс, який з'єднує людей, яким потрібна юридична порада, із
          перевіреними юристами. Консультації проходять у чаті з оновленнями в реальному часі
          (WebSocket), а вся історія листування зберігається у вашому особистому кабінеті.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Наша місія">
          Зробити юридичну допомогу доступною: прозорі ціни, рейтинги юристів і швидкий старт
          консультації без бюрократії.
        </Card>
        <Card title="Як ми перевіряємо юристів">
          Верифікація профілю адміністратором платформи, відгуки клієнтів після завершених
          консультацій і рейтинг, що перераховується автоматично.
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Технології</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((t) => (
            <Badge key={t} variant="neutral">
              {t}
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Контакти</h2>
        <Card>
          <ul className="flex flex-col gap-1">
            <li>
              Email:{' '}
              <a href={`mailto:${CONTACTS.email}`} className="text-primary-600 hover:underline">
                {CONTACTS.email}
              </a>
            </li>
            <li>
              Телефон:{' '}
              <a href={`tel:${CONTACTS.phoneHref}`} className="text-primary-600 hover:underline">
                {CONTACTS.phone}
              </a>
            </li>
            <li>
              Адреса:{' '}
              <a
                href={CONTACTS.addressUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary-600 hover:underline"
              >
                {CONTACTS.address}
              </a>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

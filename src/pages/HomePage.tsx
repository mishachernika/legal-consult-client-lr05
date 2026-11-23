import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import { ROUTES } from '@/constants';

// Демонстраційний каталог сфер права (у ЛР05 список буде з API /api/specializations)
const SPECIALIZATIONS = [
  {
    id: 1,
    name: 'Цивільне право',
    description: 'Договори, спадщина, відшкодування шкоди, право власності.',
  },
  {
    id: 2,
    name: 'Кримінальне право',
    description: 'Захист у кримінальних провадженнях на всіх стадіях.',
  },
  {
    id: 3,
    name: 'Сімейне право',
    description: 'Розірвання шлюбу, аліменти, поділ майна, усиновлення.',
  },
  {
    id: 4,
    name: 'Господарське право',
    description: 'Реєстрація бізнесу, договори між компаніями, банкрутство.',
  },
  { id: 5, name: 'Трудове право', description: 'Звільнення, невиплата зарплати, трудові спори.' },
  {
    id: 6,
    name: 'Податкове право',
    description: 'Податкові перевірки, оскарження рішень контролюючих органів.',
  },
];

const STEPS = [
  { title: 'Опишіть ситуацію', text: 'Створіть консультацію з темою та детальним описом питання.' },
  {
    title: 'Оберіть юриста',
    text: 'Перегляньте профілі, рейтинги та ціни, оберіть фахівця зі сфери права.',
  },
  {
    title: 'Спілкуйтеся в чаті',
    text: 'Обговорюйте деталі в чаті консультації — повідомлення надходять у реальному часі.',
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
      SPECIALIZATIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-10 text-center">
        <Badge variant="info">Онлайн-платформа юридичних консультацій</Badge>
        <h1 className="w-full max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">
          Юридична допомога онлайн — швидко, прозоро, у реальному часі
        </h1>
        <p className="w-full max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Оберіть юриста зі сфери права, що вас цікавить, створіть консультацію та отримуйте
          відповіді в чаті — без дзвінків і паперів.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to={ROUTES.about}>
            <Button size="lg">Дізнатися більше</Button>
          </Link>
          <Link to={ROUTES.login}>
            <Button size="lg" variant="secondary">
              Увійти
            </Button>
          </Link>
        </div>
      </section>

      {/* Статистика */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { value: '120+', label: 'юристів на платформі' },
          { value: '3 500+', label: 'проведених консультацій' },
          { value: '4.8/5', label: 'середня оцінка юристів' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-3xl font-bold text-primary-600">{s.value}</p>
            <p className="mt-1">{s.label}</p>
          </Card>
        ))}
      </section>

      {/* Пошук сфер права (демо Input + фільтрація на клієнті) */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Сфери права</h2>
          <p className="max-w-xl text-gray-600 dark:text-gray-300">
            Знайдіть фахівця під ваше питання — від сімейних спорів до податкових перевірок.
          </p>
          <div className="w-full max-w-md">
            <Input
              type="search"
              placeholder="Пошук сфери права..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Нічого не знайдено за запитом «{query}».
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Card
                key={s.id}
                title={
                  <span className="flex items-center justify-between gap-2">
                    {s.name}
                    <Badge variant="info">від 500 ₴/год</Badge>
                  </span>
                }
                footer={<Button size="sm">Знайти юриста</Button>}
              >
                {s.description}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Як це працює */}
      <section className="flex flex-col gap-6">
        <h2 className="text-center text-2xl font-bold md:text-3xl">Як це працює</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card
              key={step.title}
              title={
                <span className="flex items-center gap-2">
                  <Badge variant="success">{i + 1}</Badge>
                  {step.title}
                </span>
              }
            >
              {step.text}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary-600 px-6 py-12 text-center text-white">
        <h2 className="text-2xl font-bold md:text-3xl">Потрібна порада юриста прямо зараз?</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-100">
          Зареєструйтеся за хвилину та поставте перше запитання перевіреному фахівцеві.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={ROUTES.login}>
            <Button size="lg" variant="secondary">
              Створити акаунт
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

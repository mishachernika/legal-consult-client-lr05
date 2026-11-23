import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { PageSkeleton } from '@/components/common/Skeleton';
import ErrorMessage from '@/components/common/ErrorMessage';
import List from '@/components/common/List';
import { lawyersService } from '@/services/lawyers.service';
import { formatDate, formatPrice } from '@/utils/format';

// Детальна сторінка профілю юриста: спеціалізації, ціна, статистика, відгуки
export default function LawyerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: lawyer,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['lawyers', Number(id)],
    queryFn: () => lawyersService.getById(Number(id)),
  });

  if (isPending) return <PageSkeleton />;
  if (isError || !lawyer) return <ErrorMessage message={error?.message ?? 'Юриста не знайдено'} />;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Кабінет', to: '/dashboard' },
          { label: 'Юристи', to: '/lawyers' },
          { label: lawyer.user?.name ?? `#${lawyer.id}` },
        ]}
      />

      <Card title={lawyer.user?.name ?? `Юрист #${lawyer.userId}`}>
        <div className="flex flex-wrap items-center gap-2">
          {lawyer.specializations?.map((s) => (
            <Badge key={s.id} variant="info">
              {s.name}
            </Badge>
          ))}
          {lawyer.isVerified && <Badge variant="success">перевірений адміністратором</Badge>}
        </div>
        <p className="mt-3">{lawyer.bio ?? 'Опис відсутній.'}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-gray-500">Рейтинг</dt>
            <dd className="text-lg font-semibold">{lawyer.rating ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Досвід</dt>
            <dd className="text-lg font-semibold">{lawyer.experienceYears} р.</dd>
          </div>
          <div>
            <dt className="text-gray-500">Ціна</dt>
            <dd className="text-lg font-semibold text-primary-600">
              {formatPrice(lawyer.pricePerHour)}/год
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Консультацій</dt>
            <dd className="text-lg font-semibold">{lawyer.consultationsCount}</dd>
          </div>
        </dl>
        <div className="mt-5">
          <Button onClick={() => navigate(`/consultations/create?lawyerId=${lawyer.userId}`)}>
            Замовити консультацію
          </Button>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-2xl font-bold">Відгуки ({lawyer.reviews.length})</h2>
        {lawyer.reviews.length === 0 ? (
          <p className="text-gray-500">Відгуків ще немає.</p>
        ) : (
          <List>
            {lawyer.reviews.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning">Оцінка {r.rating} / 5</Badge>
                  <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                </div>
                {r.text && <p className="mt-2 text-sm">{r.text}</p>}
              </li>
            ))}
          </List>
        )}
      </section>

      <div>
        <Link to="/lawyers" className="text-sm text-primary-600 hover:underline">
          ← До каталогу юристів
        </Link>
      </div>
    </div>
  );
}

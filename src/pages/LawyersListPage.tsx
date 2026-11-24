import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Badge from '@/components/common/Badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Grid from '@/components/common/Grid';
import Input from '@/components/common/Input';
import Pagination from '@/components/common/Pagination';
import Select from '@/components/common/Select';
import { CardGridSkeleton } from '@/components/common/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { lawyersService, type LawyersQuery } from '@/services/lawyers.service';
import { specializationsService } from '@/services/specializations.service';
import { formatPrice } from '@/utils/format';

const SORT_OPTIONS = [
  { value: 'rating:desc', label: 'За рейтингом (спочатку найвищий)' },
  { value: 'rating:asc', label: 'За рейтингом (спочатку найнижчий)' },
  { value: 'pricePerHour:asc', label: 'За ціною (спочатку дешевші)' },
  { value: 'pricePerHour:desc', label: 'За ціною (спочатку дорожчі)' },
  { value: 'experienceYears:desc', label: 'За досвідом (спочатку досвідченіші)' },
] as const;

// Каталог юристів: пошук (debounce), фільтр за сферою права, сортування, пагінація
export default function LawyersListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(searchInput);
  const specializationId = searchParams.get('specializationId') ?? '';
  const sort = searchParams.get('sort') ?? 'rating:desc';

  const [sortBy, order] = sort.split(':') as [LawyersQuery['sortBy'], LawyersQuery['order']];

  const query: LawyersQuery = {
    page,
    limit: 9,
    search: debouncedSearch || undefined,
    specializationId: specializationId === '' ? undefined : Number(specializationId),
    sortBy,
    order,
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['lawyers', query],
    queryFn: () => lawyersService.getAll(query),
    placeholderData: keepPreviousData,
  });

  const { data: specializations } = useQuery({
    queryKey: ['specializations'],
    queryFn: specializationsService.getAll,
  });

  function updateParams(patch: Record<string, string>) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v === '' || v === '1') next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next);
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Кабінет', to: '/dashboard' }, { label: 'Юристи' }]} />
      <h1 className="mb-6 text-3xl font-bold">Каталог юристів</h1>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          aria-label="Пошук юристів"
          placeholder="Пошук за ім'ям або описом..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateParams({ search: e.target.value, page: '1' });
          }}
        />
        <Select
          aria-label="Фільтр за сферою права"
          value={specializationId}
          onChange={(e) => updateParams({ specializationId: e.target.value, page: '1' })}
        >
          <option value="">Усі сфери права</option>
          {specializations?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Сортування"
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value, page: '1' })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {isPending && <CardGridSkeleton />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка завантаження: {error.message}
        </p>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <p className="py-10 text-center text-gray-500">За вашим запитом юристів не знайдено.</p>
          ) : (
            <Grid>
              {data.data.map((l) => (
                <Card
                  key={l.id}
                  className="flex h-full cursor-pointer flex-col transition-shadow hover:shadow-lg"
                  title={
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate">{l.user?.name ?? `Юрист #${l.userId}`}</span>
                      {l.isVerified && <Badge variant="success">перевірений</Badge>}
                    </span>
                  }
                  footer={
                    <Button
                      size="sm"
                      onClick={() => navigate(`/consultations/create?lawyerId=${l.userId}`)}
                    >
                      Замовити консультацію
                    </Button>
                  }
                >
                  <div className="flex flex-wrap gap-1">
                    {l.specializations?.map((s) => (
                      <Badge key={s.id} variant="info">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm">{l.bio ?? 'Опис відсутній.'}</p>
                  <p className="mt-2 text-sm">
                    Рейтинг: <span className="font-semibold">{l.rating ?? '—'}</span> · Досвід:{' '}
                    {l.experienceYears} р. ·{' '}
                    <span className="font-semibold text-primary-600">
                      {formatPrice(l.pricePerHour)}/год
                    </span>
                  </p>
                  <Link
                    to={`/lawyers/${l.id}`}
                    className="mt-2 text-sm text-primary-600 hover:underline"
                  >
                    Деталі профілю →
                  </Link>
                </Card>
              ))}
            </Grid>
          )}
          <Pagination
            meta={data.pagination}
            page={page}
            onPageChange={(p) => updateParams({ page: String(p) })}
          />
        </>
      )}
    </div>
  );
}

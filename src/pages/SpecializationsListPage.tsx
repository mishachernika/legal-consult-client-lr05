import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import { TableSkeleton } from '@/components/common/Skeleton';
import Table, { type TableColumn } from '@/components/common/Table';
import { useDebounce } from '@/hooks/useDebounce';
import {
  specializationsService,
  type SpecializationQuery,
} from '@/services/specializations.service';
import { useAuthStore } from '@/stores/authStore';
import type { Specialization } from '@/types/api.types';

// Сфери права: публічний список із пошуком; адмін додатково редагує та видаляє
export default function SpecializationsListPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search);

  const query: SpecializationQuery = { page, limit: 10, search: debouncedSearch || undefined };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['specializations', query],
    queryFn: () => specializationsService.getAll(query),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => specializationsService.remove(id),
    onSuccess: () => {
      toast.success('Сферу права видалено');
      setDeleteId(null);
      return queryClient.invalidateQueries({ queryKey: ['specializations'] });
    },
    onError: (e) => toast.error(e.message || 'Не вдалося видалити'),
  });

  const columns: TableColumn<Specialization>[] = [
    { key: 'id', header: 'ID', render: (s) => s.id },
    { key: 'name', header: 'Назва', render: (s) => <span className="font-medium">{s.name}</span> },
    { key: 'description', header: 'Опис', render: (s) => s.description ?? '—' },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Дії',
            className: 'text-right',
            render: (s: Specialization) => (
              <span className="inline-flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/specializations/${s.id}/edit`)}
                >
                  Редагувати
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteId(s.id)}>
                  Видалити
                </Button>
              </span>
            ),
          } as TableColumn<Specialization>,
        ]
      : []),
  ];

  const deleting = data?.data.find((s) => s.id === deleteId);

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Кабінет', to: '/dashboard' }, { label: 'Сфери права' }]} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Сфери права</h1>
        {isAdmin && (
          <Link to="/specializations/create">
            <Button>Додати сферу</Button>
          </Link>
        )}
      </div>

      <div className="mb-4">
        <Input
          aria-label="Пошук сфер права"
          placeholder="Пошук за назвою..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isPending && <TableSkeleton />}
      {isError && (
        <p role="alert" className="text-red-500">
          Помилка завантаження: {error.message}
        </p>
      )}

      {data && (
        <>
          <Table
            columns={columns}
            rows={data.data}
            rowKey={(s) => s.id}
            emptyMessage="Сфери права не знайдено"
          />
          <Pagination meta={data.pagination} page={page} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={deleteId !== null}
        title="Видалити сферу права?"
        confirmText="Видалити"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        onClose={() => setDeleteId(null)}
      >
        {deleting && <p>Сферу «{deleting.name}» буде видалено з каталогу.</p>}
      </Modal>
    </div>
  );
}

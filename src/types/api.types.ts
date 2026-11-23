// Типи відповідей API серверної частини (legal-consult-api, ЛР01–ЛР03).
// Назви полів і enum'и збігаються з prisma/schema.prisma сервера.

export type Role = 'CLIENT' | 'LAWYER' | 'ADMIN';

export type ConsultationStatus =
  'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type NotificationType =
  | 'CONSULTATION_CREATED'
  | 'CONSULTATION_UPDATED'
  | 'CONSULTATION_CANCELLED'
  | 'MESSAGE_NEW'
  | 'REVIEW_NEW'
  | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Публічні поля чужого профілю (email/телефон віддає лише адмін — див. ЛР02) */
export type PublicUser = Pick<User, 'id' | 'name' | 'role' | 'avatar'>;

export interface Specialization {
  id: number;
  name: string;
  description: string | null;
}

export interface LawyerProfile {
  id: number;
  userId: number;
  bio: string | null;
  experienceYears: number;
  /** Decimal у JSON серіалізується рядком */
  pricePerHour: string;
  rating: string | null;
  isVerified: boolean;
  user?: User;
  specializations?: Specialization[];
}

export interface Consultation {
  id: number;
  clientId: number;
  lawyerId: number;
  topic: string;
  description: string;
  status: ConsultationStatus;
  scheduledAt: string | null;
  price: string | null;
  createdAt: string;
  updatedAt: string;
  client?: PublicUser;
  lawyer?: PublicUser;
}

export interface Message {
  id: number;
  consultationId: number;
  senderId: number;
  text: string;
  createdAt: string;
  sender?: PublicUser;
}

export interface Review {
  id: number;
  consultationId: number;
  clientId: number;
  lawyerId: number;
  rating: number;
  text: string | null;
  createdAt: string;
}

export interface AppFile {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedBy: number;
  consultationId: number | null;
  createdAt: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

// Формат пагінованої відповіді серверної частини з ЛР02
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

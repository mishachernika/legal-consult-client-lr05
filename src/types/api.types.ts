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

/** Учасник консультації у відповіді сервера (consultationInclude) */
export interface Participant {
  id: number;
  name: string;
  email: string;
}

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
  client?: Participant;
  lawyer?: Participant;
}

export interface Message {
  id: number;
  consultationId: number;
  senderId: number;
  text: string;
  createdAt: string;
  sender?: Pick<User, 'id' | 'name' | 'role'>;
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

/** Окремий запис повертається в обгортці { data: ... } */
export interface SingleResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// GET /api/notifications повертає пагінацію + лічильник непрочитаних
export interface NotificationsResponse extends PaginatedResponse<AppNotification> {
  unreadCount: number;
}

// GET /api/lawyers/:id — профіль + кількість консультацій + відгуки
export type LawyerDetail = LawyerProfile & {
  consultationsCount: number;
  reviews: Review[];
};

// GET /api/consultations/:id — консультація з учасниками та відгуком
export type ConsultationDetail = Consultation & {
  messages?: Message[];
  review?: Review | null;
};

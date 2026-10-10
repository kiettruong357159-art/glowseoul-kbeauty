/**
 * Chuẩn Cấu Trúc Trả Về Hệ Thống (Server Action & API Envelope)
 * Theo quy chuẩn TECH.md (Mục III.2)
 */

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T = unknown> = {
  items: T[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
};

/**
 * Helper tạo phản hồi thành công chuẩn
 */
export function successResponse<T>(data: T, message?: string): ActionResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Helper tạo phản hồi lỗi chuẩn
 */
export function errorResponse(error: string): ActionResponse<never> {
  return {
    success: false,
    error,
  };
}

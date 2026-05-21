export interface PaginationParams {
  page?: number
  perPage?: number
}

export function paginate({ page = 1, perPage = 10 }: PaginationParams) {
  return { skip: (page - 1) * perPage, take: perPage }
}

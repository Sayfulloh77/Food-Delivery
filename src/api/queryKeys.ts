export const queryKeys = {
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', id] as const,
    byRestaurant: (restaurantId: string) => ['orders', 'restaurant', restaurantId] as const,
    courierPool: (pool: 'available' | 'delivering') => ['orders', 'courier', pool] as const,
  },
  restaurants: {
    all: ['restaurants'] as const,
    detail: (uuid: string) => ['restaurants', uuid] as const,
    byOwner: (ownerId: number) => ['restaurants', 'owner', ownerId] as const,
    menu: (uuid: string) => ['restaurants', uuid, 'menu'] as const,
  },
  categories: { all: ['categories'] as const },
  menuCategories: { all: ['menuCategories'] as const },
  menuItems: { all: ['menuItems'] as const },
  ads: { all: ['ads'] as const },
  search: (query: string) => ['search', query] as const,
  notifications: { all: ['notifications'] as const },
  users: {
    tab: (tab: string) => ['users', tab] as const,
  },
  roles: {
    all: ['roles'] as const,
    forClient: ['roles', 'client'] as const,
  },
}

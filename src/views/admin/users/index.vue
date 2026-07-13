<template>
  <div class="space-y-5">

    <!-- Tabs -->
    <div class="flex gap-1 p-1 rounded-xl w-full sm:w-fit overflow-x-auto" style="background:#060d1c">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :style="activeTab === tab.key ? 'background:#f97316;color:#000' : 'color:#64748b'"
      >
        {{ tab.label }}
        <span class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" :class="activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-600'">
          {{ counts[tab.key] }}
        </span>
      </button>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border overflow-hidden" style="background:#060d1c;border-color:#1a2d4d">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style="border-color:#f97316;border-top-color:transparent" />
      </div>

      <div v-else-if="rows.length === 0" class="flex flex-col items-center justify-center py-16 text-zinc-700">
        <Users class="w-10 h-10 mb-2 opacity-40" />
        <p class="text-sm">No {{ activeTab }} found</p>
      </div>

      <div v-else class="overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead class="border-b" style="background:#0d1b35;border-color:#1a2d4d">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Name</th>
            <th class="text-left px-5 py-3 font-medium text-zinc-500">Email</th>
            <th v-if="activeTab === 'users'" class="text-left px-5 py-3 font-medium text-zinc-500">Role</th>
            <th v-if="activeTab === 'users'" class="text-left px-5 py-3 font-medium text-zinc-500">Status</th>
            <th class="text-right px-5 py-3 font-medium text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="border-b transition-colors hover:bg-white/2" style="border-color:#1a2d4d">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold shrink-0" style="background:#f97316">
                  {{ (row.name || row.email || '?').charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium text-white">{{ row.name || '—' }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-zinc-500">{{ row.email || '—' }}</td>
            <td v-if="activeTab === 'users'" class="px-5 py-3.5">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="roleColor(row.role)">{{ row.role || '—' }}</span>
            </td>
            <td v-if="activeTab === 'users'" class="px-5 py-3.5">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="row.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'">
                {{ row.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center justify-end gap-2">
                <button v-if="activeTab === 'users' && !row.is_active" @click="activateUser(row.id)" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">Activate</button>
                <button v-if="activeTab === 'users' && !isAdminRow(row)" @click="openRoleModal(row)" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">Role</button>
                <button v-if="activeTab !== 'admins' && !isAdminRow(row)" @click="removeRow(row.id)" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Change Role Modal -->
    <div v-if="roleModal.show" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="rounded-2xl shadow-2xl w-full max-w-sm p-6 border" style="background:#0d1b35;border-color:#1a2d4d">
        <h3 class="text-lg font-bold text-white mb-1">Change Role</h3>
        <p class="text-sm text-zinc-500 mb-5">{{ roleModal.user?.name || roleModal.user?.email }}</p>
        <select v-model="roleModal.selectedRoleId" class="admin-input w-full mb-4">
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
        <div class="flex gap-3">
          <button @click="roleModal.show = false" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-white/5 transition-colors">Cancel</button>
          <button @click="updateRole" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-85" style="background:#f97316">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { Users } from '@lucide/vue'
import { usersApi, customersApi, couriersApi, restaurantOwnersApi, adminsApi, rolesApi } from '@/api/users'
import { queryKeys } from '@/api/queryKeys'

type Tab = 'users' | 'customers' | 'couriers' | 'owners' | 'admins'

interface Role {
  id: number
  name: string
}

interface UserRow {
  id: number
  name?: string
  email?: string
  role?: string
  is_active?: boolean
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'users', label: 'All Users' },
  { key: 'customers', label: 'Customers' },
  { key: 'couriers', label: 'Couriers' },
  { key: 'owners', label: 'Owners' },
  { key: 'admins', label: 'Admins' },
]

const queryClient = useQueryClient()
const activeTab = ref<Tab>('users')
const roleModal = ref<{ show: boolean; user: UserRow | null; selectedRoleId: number | null }>({ show: false, user: null, selectedRoleId: null })

const apiMap: Record<Exclude<Tab, 'users'>, () => Promise<{ data: UserRow[] }>> = {
  customers: customersApi.getAll,
  couriers: couriersApi.getAll, owners: restaurantOwnersApi.getAll, admins: adminsApi.getAll,
}
const deleteApiMap: Record<Tab, (id: number) => Promise<unknown>> = {
  users: (id) => usersApi.remove(id), customers: (id) => customersApi.remove(id),
  couriers: (id) => couriersApi.remove(id), owners: (id) => restaurantOwnersApi.remove(id), admins: (id) => adminsApi.remove(id),
}

// GET /users returns the shared users table directly (real id, email, role, is_active) —
// using this instead of merging the per-role endpoints avoids acting on the wrong id,
// since /customers, /couriers, /restaurant-owners expose their own table's id, not users.id.
async function fetchTab(tab: Tab): Promise<UserRow[]> {
  if (tab === 'users') {
    const res = await usersApi.getAll()
    return res.data?.data ?? []
  }
  return (await apiMap[tab]()).data ?? []
}

// One query per tab, cached independently by TanStack Query — switching tabs re-hits
// the cache instead of refetching, replacing the old "if (data[tab].length) return" guard.
const activeTabQuery = useQuery({
  queryKey: computed(() => queryKeys.users.tab(activeTab.value)),
  queryFn: () => fetchTab(activeTab.value),
})
const rows = computed(() => activeTabQuery.data.value ?? [])
const loading = activeTabQuery.isLoading

// Tab pill counts need every tab's data, not just the active one — fetch them all
// (each hits the same per-tab cache the active-tab query above uses).
const tabQueries = Object.fromEntries(
  tabs.map(t => [t.key, useQuery({ queryKey: queryKeys.users.tab(t.key), queryFn: () => fetchTab(t.key) })])
) as Record<Tab, ReturnType<typeof useQuery<UserRow[]>>>
const counts = computed(() => Object.fromEntries(tabs.map(t => [t.key, tabQueries[t.key].data.value?.length ?? 0])))

const rolesQuery = useQuery({
  queryKey: queryKeys.roles.all,
  queryFn: () => rolesApi.getAll().then(res => res.data ?? []),
})
const roles = computed<Role[]>(() => rolesQuery.data.value ?? [])

function errorMessage(e: unknown, fallback: string) {
  return (e as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback
}

const activateMutation = useMutation({
  mutationFn: (id: number) => usersApi.activate(id),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.tab('users') }),
  onError: (e) => alert(errorMessage(e, 'Failed to activate user.')),
})
function activateUser(id: number) { activateMutation.mutate(id) }

function openRoleModal(user: UserRow) {
  roleModal.value = { show: true, user, selectedRoleId: roles.value[0]?.id ?? null }
}

const updateRoleMutation = useMutation({
  mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => usersApi.updateRole(userId, roleId),
  onSuccess: () => {
    roleModal.value.show = false
    // A role change moves the user out of one tab's bucket (e.g. Owners) and into
    // another (e.g. Customers) — invalidate every tab, not just "users", so both
    // the old and new tab reflect it immediately instead of only after a manual refresh.
    tabs.forEach(t => queryClient.invalidateQueries({ queryKey: queryKeys.users.tab(t.key) }))
  },
})
function updateRole() {
  if (!roleModal.value.user || roleModal.value.selectedRoleId == null) return
  updateRoleMutation.mutate({ userId: roleModal.value.user.id, roleId: roleModal.value.selectedRoleId })
}

const removeMutation = useMutation({
  mutationFn: ({ tab, id }: { tab: Tab; id: number }) => deleteApiMap[tab](id),
  onSuccess: (_res, { tab }) => queryClient.invalidateQueries({ queryKey: queryKeys.users.tab(tab) }),
  onError: (e) => alert(errorMessage(e, 'Failed to delete this record.')),
})
function removeRow(id: number) {
  if (!confirm('Delete this record?')) return
  removeMutation.mutate({ tab: activeTab.value, id })
}

// Admins/superadmins are managed deliberately (there's no self-service create/delete
// for them anymore) — Role and Delete on the All Users table must not touch these rows.
function isAdminRow(row: UserRow) {
  return row.role === 'ADMIN' || row.role === 'SUPERADMIN'
}

function roleColor(role: string | undefined) {
  const m: Record<string, string> = { ADMIN: 'bg-purple-500/15 text-purple-400', SUPERADMIN: 'bg-red-500/15 text-red-400', CUSTOMER: 'bg-blue-500/15 text-blue-400', COURIER: 'bg-green-500/15 text-green-400', RESTAURANT_OWNER: 'bg-orange-500/15 text-orange-400' }
  return (role && m[role]) ?? 'bg-zinc-500/15 text-zinc-400'
}
</script>

<style scoped>
.admin-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #060d1c;
  border: 1px solid #1a2d4d;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.admin-input { background: #060d1c; border-color: #1a2d4d; }
.admin-input:focus { border-color: #f97316; }
.admin-input option { background: #060d1c; }
.admin-input option { background: #1a1a1a; }
</style>

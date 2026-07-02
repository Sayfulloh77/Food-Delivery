<template>
  <div class="space-y-5">

    <!-- Tabs -->
    <div class="flex gap-1 p-1 rounded-xl w-fit" style="background:#060d1c">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
        :style="activeTab === tab.key ? 'background:#f97316;color:#000' : 'color:#64748b'"
      >
        {{ tab.label }}
        <span class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" :class="activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-600'">
          {{ counts[tab.key] }}
        </span>
      </button>
    </div>

    <!-- Create Admin -->
    <div v-if="activeTab === 'admins'" class="flex justify-end">
      <button @click="showCreateAdmin = true" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-black transition-all hover:opacity-85" style="background:#f97316">
        <Plus class="w-4 h-4" /> Create Admin
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

      <table v-else class="w-full text-sm">
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
                <button v-if="activeTab === 'users'" @click="openRoleModal(row)" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">Role</button>
                <button @click="removeRow(row.id)" class="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Admin Modal -->
    <div v-if="showCreateAdmin" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="rounded-2xl shadow-2xl w-full max-w-md p-6 border" style="background:#0d1b35;border-color:#1a2d4d">
        <h3 class="text-lg font-bold text-white mb-5">Create Admin</h3>
        <div class="space-y-4">
          <AdminField label="Name"><input v-model="adminForm.name" type="text" placeholder="Full name" class="admin-input" /></AdminField>
          <AdminField label="Email"><input v-model="adminForm.email" type="email" placeholder="admin@example.com" class="admin-input" /></AdminField>
          <AdminField label="Password"><input v-model="adminForm.password" type="password" placeholder="••••••••" class="admin-input" /></AdminField>
          <AdminField label="Role">
            <select v-model="adminForm.role_id" class="admin-input">
              <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
            </select>
          </AdminField>
        </div>
        <p v-if="createError" class="mt-3 text-sm text-red-400">{{ createError }}</p>
        <div class="flex gap-3 mt-6">
          <button @click="showCreateAdmin = false; createError = ''" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-white/5 transition-colors">Cancel</button>
          <button @click="createAdmin" :disabled="creating" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-black transition-all hover:opacity-85" style="background:#f97316">
            {{ creating ? 'Creating...' : 'Create' }}
          </button>
        </div>
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

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Users, Plus } from '@lucide/vue'
import { usersApi, customersApi, couriersApi, restaurantOwnersApi, adminsApi, rolesApi } from '@/api/users'

const AdminField = {
  props: ['label'],
  template: `<div><label class="block text-xs font-medium text-zinc-500 mb-1.5">{{ label }}</label><slot /></div>`,
}

const tabs = [
  { key: 'users', label: 'All Users' },
  { key: 'customers', label: 'Customers' },
  { key: 'couriers', label: 'Couriers' },
  { key: 'owners', label: 'Owners' },
  { key: 'admins', label: 'Admins' },
]

const activeTab = ref('users')
const loading = ref(false)
const data = ref({ users: [], customers: [], couriers: [], owners: [], admins: [] })
const roles = ref([])
const showCreateAdmin = ref(false)
const creating = ref(false)
const createError = ref('')
const adminForm = ref({ name: '', email: '', password: '', role_id: null })
const roleModal = ref({ show: false, user: null, selectedRoleId: null })

const rows = computed(() => data.value[activeTab.value] ?? [])
const counts = computed(() => Object.fromEntries(tabs.map(t => [t.key, data.value[t.key]?.length ?? 0])))

const apiMap = {
  users: usersApi.getAll, customers: customersApi.getAll,
  couriers: couriersApi.getAll, owners: restaurantOwnersApi.getAll, admins: adminsApi.getAll,
}
const deleteApiMap = {
  users: (id) => usersApi.remove(id), customers: (id) => customersApi.remove(id),
  couriers: (id) => couriersApi.remove(id), owners: (id) => restaurantOwnersApi.remove(id), admins: (id) => adminsApi.remove(id),
}

async function loadTab(tab) {
  if (data.value[tab].length > 0) return
  loading.value = true
  try { const res = await apiMap[tab](); data.value[tab] = res.data ?? [] }
  catch { data.value[tab] = [] }
  finally { loading.value = false }
}

async function loadRoles() {
  try { const res = await rolesApi.getAll(); roles.value = res.data ?? []; if (roles.value.length) adminForm.value.role_id = roles.value[0].id }
  catch { roles.value = [] }
}

async function activateUser(id) {
  try { await usersApi.activate(id); const u = data.value.users.find(u => u.id === id); if (u) u.is_active = true }
  catch {}
}

function openRoleModal(user) {
  roleModal.value = { show: true, user, selectedRoleId: roles.value[0]?.id ?? null }
}

async function updateRole() {
  try { await usersApi.updateRole(roleModal.value.user.id, roleModal.value.selectedRoleId); roleModal.value.show = false; data.value.users = []; await loadTab('users') }
  catch {}
}

async function removeRow(id) {
  if (!confirm('Delete this record?')) return
  try { await deleteApiMap[activeTab.value](id); data.value[activeTab.value] = data.value[activeTab.value].filter(r => r.id !== id) }
  catch (e) { alert(e.response?.data?.message ?? 'Failed to delete this record.') }
}

async function createAdmin() {
  creating.value = true; createError.value = ''
  try {
    const res = await adminsApi.create(adminForm.value)
    data.value.admins.unshift(res.data)
    showCreateAdmin.value = false
    adminForm.value = { name: '', email: '', password: '', role_id: roles.value[0]?.id ?? null }
    activeTab.value = 'admins'
  } catch (e) { createError.value = e.response?.data?.message ?? 'Failed to create admin' }
  finally { creating.value = false }
}

function roleColor(role) {
  const m = { ADMIN: 'bg-purple-500/15 text-purple-400', SUPERADMIN: 'bg-red-500/15 text-red-400', CUSTOMER: 'bg-blue-500/15 text-blue-400', COURIER: 'bg-green-500/15 text-green-400', RESTAURANT_OWNER: 'bg-orange-500/15 text-orange-400' }
  return m[role] ?? 'bg-zinc-500/15 text-zinc-400'
}

watch(activeTab, tab => loadTab(tab))
onMounted(() => { loadTab('users'); loadRoles() })
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

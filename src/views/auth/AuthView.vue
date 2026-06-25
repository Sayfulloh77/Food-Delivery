<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center justify-center gap-2 mb-8">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#ff5722">
          <UtensilsCrossed class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-2xl tracking-tight text-gray-900">
          Food<span style="color:#ff5722">Express</span>
        </span>
      </RouterLink>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <!-- Tabs (hidden on otp + verify steps) -->
        <div v-if="mode === 'signin' || mode === 'signup'" class="flex bg-gray-100 rounded-xl p-1 mb-7">
          <button
            @click="switchMode('signin')"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
            :class="mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >Sign in</button>
          <button
            @click="switchMode('signup')"
            class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
            :class="mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >Sign up</button>
        </div>

        <!-- ── SIGN IN ── -->
        <form v-if="mode === 'signin'" @submit.prevent="handleSignIn" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signIn.email" type="email" placeholder="you@example.com" required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-all" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signIn.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required
                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-all" />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Eye v-if="!showPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" :class="loading ? 'btn-disabled' : ''">
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <!-- ── SIGN UP — step 1: email ── -->
        <form v-else-if="mode === 'signup'" @submit.prevent="handleSendOtp" class="space-y-4">
          <p class="text-sm text-gray-500 -mt-2 mb-1">We'll send a verification code to your email first.</p>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signUp.email" type="email" placeholder="you@example.com" required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-all" />
            </div>
          </div>
          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" :class="loading ? 'btn-disabled' : ''">
            {{ loading ? 'Sending code…' : 'Send verification code' }}
          </button>
        </form>

        <!-- ── SIGN UP — step 2: OTP ── -->
        <div v-else-if="mode === 'otp'" class="text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style="background:#fff3f0">
            <ShieldCheck class="w-7 h-7" style="color:#ff5722" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-1">Check your email</h2>
          <p class="text-sm text-gray-500 mb-7">
            We sent a 5-digit code to <span class="font-medium text-gray-700">{{ signUp.email }}</span>
          </p>

          <div class="flex justify-center gap-2 mb-6">
            <input
              v-for="(_, i) in code" :key="i"
              :ref="el => { if (el) codeRefs[i] = el }"
              v-model="code[i]" type="text" maxlength="1" inputmode="numeric"
              @input="onCodeInput(i)" @keydown.backspace="onBackspace(i)" @paste.prevent="onPaste"
              class="w-11 h-12 text-center text-lg font-bold border rounded-xl outline-none transition-all"
              :class="code[i] ? 'border-orange-400 bg-orange-50' : 'border-gray-200'"
            />
          </div>

          <p v-if="error" class="text-red-500 text-xs mb-3">{{ error }}</p>

          <button @click="handleVerifyOtp" :disabled="codeValue.length < 5 || loading"
            class="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white mb-4"
            :class="(codeValue.length < 5 || loading) ? 'btn-disabled' : ''">
            {{ loading ? 'Verifying…' : 'Verify code' }}
          </button>

          <p class="text-sm text-gray-500">
            Didn't receive it?
            <button @click="handleResend" :disabled="resendCooldown > 0"
              class="font-semibold ml-1 transition-colors"
              :class="resendCooldown > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-orange-500 hover:text-orange-700'">
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend' }}
            </button>
          </p>

          <button @click="switchMode('signup')" class="mt-5 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto">
            <ArrowLeft class="w-3 h-3" /> Back
          </button>
        </div>

        <!-- ── SIGN UP — step 3: details ── -->
        <form v-else-if="mode === 'details'" @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-6 h-6 rounded-full flex items-center justify-center" style="background:#fff3f0">
              <CheckCircle class="w-4 h-4" style="color:#ff5722" />
            </div>
            <p class="text-sm text-gray-500">Email verified — finish creating your account</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signUp.name" type="text" placeholder="John Doe" required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-all" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signUp.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required
                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 transition-all" />
              <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Eye v-if="!showPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input v-model="signUp.confirmPassword" :type="showConfirmPass ? 'text' : 'password'" placeholder="••••••••" required
                class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all"
                :class="passwordMismatch ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-orange-400'" />
              <button type="button" @click="showConfirmPass = !showConfirmPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Eye v-if="!showConfirmPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">Passwords do not match</p>
          </div>

          <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>

          <button type="submit" :disabled="loading || passwordMismatch"
            class="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2"
            :class="(loading || passwordMismatch) ? 'btn-disabled' : ''">
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, User, CheckCircle } from '@lucide/vue'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function redirectByRole() {
  const role = authStore.user?.role ?? authStore.user?.roles?.[0]
  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    router.push('/admin/users')
  } else {
    router.push('/')
  }
}

// 'signin' | 'signup' | 'otp' | 'details'
const mode = ref('signin')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)
const showConfirmPass = ref(false)

// Sign in
const signIn = ref({ email: '', password: '' })

// Sign up (persists across steps)
const signUp = ref({ email: '', name: '', password: '', confirmPassword: '' })
const otpToken = ref('')

const passwordMismatch = computed(() =>
  signUp.value.confirmPassword.length > 0 && signUp.value.password !== signUp.value.confirmPassword
)

// OTP code
const code = ref(['', '', '', '', ''])
const codeRefs = ref([])
const codeValue = computed(() => code.value.join(''))

// Resend cooldown
const resendCooldown = ref(0)
let cooldownTimer = null

function startCooldown() {
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    if (--resendCooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
}

onUnmounted(() => clearInterval(cooldownTimer))

function switchMode(target) {
  mode.value = target
  error.value = ''
  showPass.value = false
}

// Step 1 — send OTP
async function handleSendOtp() {
  error.value = ''
  loading.value = true
  try {
    await authApi.sentOtp(signUp.value.email)
    code.value = ['', '', '', '', '']
    mode.value = 'otp'
    startCooldown()
  } catch (e) {
    error.value = e?.response?.data?.message ?? 'Failed to send code. Try again.'
  } finally {
    loading.value = false
  }
}

// Step 2 — verify OTP
async function handleVerifyOtp() {
  error.value = ''
  loading.value = true
  try {
    const res = await authApi.verifyOtp(signUp.value.email, codeValue.value)
    otpToken.value = res.data?.otpToken ?? res.data?.token ?? res.data
    mode.value = 'details'
  } catch (e) {
    error.value = e?.response?.data?.message ?? 'Invalid or expired code.'
  } finally {
    loading.value = false
  }
}

// Step 3 — register
async function handleRegister() {
  if (passwordMismatch.value) return
  error.value = ''
  loading.value = true
  try {
    const res = await authApi.register({
      name: signUp.value.name,
      email: signUp.value.email,
      password: signUp.value.password,
      role_id: 1,
      otpToken: otpToken.value,
    })
    const { access_token, refresh_token } = res.data
    authStore.setTokens(access_token, refresh_token)
    await authStore.fetchMe()
    redirectByRole()
  } catch (e) {
    error.value = e?.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

async function handleSignIn() {
  error.value = ''
  loading.value = true
  try {
    const res = await authApi.login(signIn.value.email, signIn.value.password)
    const { access_token, refresh_token } = res.data
    authStore.setTokens(access_token, refresh_token)
    await authStore.fetchMe()
    redirectByRole()
  } catch (e) {
    error.value = e?.response?.data?.message ?? 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}

async function handleResend() {
  if (resendCooldown.value > 0) return
  code.value = ['', '', '', '', '']
  await handleSendOtp()
}

function onCodeInput(index) {
  const val = code.value[index]
  if (val && !/^\d$/.test(val)) { code.value[index] = ''; return }
  if (val && index < 4) codeRefs.value[index + 1]?.focus()
}

function onBackspace(index) {
  if (!code.value[index] && index > 0) codeRefs.value[index - 1]?.focus()
}

function onPaste(e) {
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
  text.split('').forEach((char, i) => { code.value[i] = char })
  codeRefs.value[Math.min(text.length, 4)]?.focus()
}
</script>

<style scoped>
.btn-primary {
  background: #ff5722;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
}
.btn-primary:not(.btn-disabled):hover {
  background: #e64a19;
  box-shadow: 0 4px 14px rgba(255, 87, 34, 0.4);
}
.btn-primary:not(.btn-disabled):active {
  transform: scale(0.98);
  background: #d84315;
}
.btn-disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
</style>

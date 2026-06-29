<template>
  <div class="min-h-screen flex" style="background:#060d1c">

    <!-- Left decorative panel -->
    <div class="hidden lg:flex flex-col justify-between w-96 shrink-0 p-10 border-r" style="background:#080f22;border-color:#1a2d4d">
      <BrandLogo :size="36" :fontSize="18" />

      <div>
        <!-- Animated food illustration placeholder -->
        <div class="w-48 h-48 mx-auto mb-8 rounded-3xl flex items-center justify-center" style="background:rgba(249,115,22,0.08);border:1px solid rgba(249,115,22,0.15)">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="30" fill="rgba(249,115,22,0.12)"/>
            <path d="M20 45 C20 58 60 58 60 45" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
            <path d="M30 35 Q32 30 30 25" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M40 33 Q42 28 40 23" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M50 35 Q52 30 50 25" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="17" y1="50" x2="63" y2="50" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>

        <h2 class="text-3xl font-extrabold text-white leading-tight mb-4">
          Order food from<br/>the best restaurants<br/>near you.
        </h2>
        <p class="text-slate-500 text-sm leading-relaxed">
          Fast delivery, fresh ingredients, great prices — all in one place.
        </p>
        <div class="flex gap-6 mt-8">
          <div>
            <p class="text-2xl font-bold text-white">10+</p>
            <p class="text-xs text-slate-600 mt-0.5">Restaurants</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">30min</p>
            <p class="text-xs text-slate-600 mt-0.5">Avg delivery</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-white">5★</p>
            <p class="text-xs text-slate-600 mt-0.5">Rated</p>
          </div>
        </div>
      </div>

      <p class="text-xs text-slate-700">© {{ new Date().getFullYear() }} FoodExpress</p>
    </div>

    <!-- Right — form -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">

        <!-- Mobile logo -->
        <div class="flex justify-center mb-8 lg:hidden">
          <BrandLogo :size="36" :fontSize="18" />
        </div>

        <!-- Card -->
        <div class="rounded-2xl border p-8" style="background:#0d1b35;border-color:#1a2d4d">

          <!-- Tabs -->
          <div v-if="mode === 'signin' || mode === 'signup'" class="flex gap-1 p-1 rounded-xl mb-7" style="background:#060d1c">
            <button
              @click="switchMode('signin')"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              :style="mode === 'signin' ? 'background:#f97316;color:#000' : 'color:#64748b'"
            >Sign in</button>
            <button
              @click="switchMode('signup')"
              class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              :style="mode === 'signup' ? 'background:#f97316;color:#000' : 'color:#64748b'"
            >Sign up</button>
          </div>

          <!-- ── SIGN IN ── -->
          <form v-if="mode === 'signin'" @submit.prevent="handleSignIn" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <input v-model="signIn.email" type="email" placeholder="you@example.com" required class="auth-input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div class="relative">
                <input v-model="signIn.password" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required class="auth-input pr-10" />
                <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                  <Eye v-if="!showPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
            <button type="submit" :disabled="loading" class="auth-btn w-full py-3 mt-1" :class="loading ? 'auth-btn-disabled' : ''">
              {{ loading ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <!-- ── SIGN UP step 1: email ── -->
          <form v-else-if="mode === 'signup'" @submit.prevent="handleSendOtp" class="space-y-4">
            <p class="text-xs text-slate-500 -mt-2 mb-2">We'll send a verification code to your email first.</p>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <input v-model="signUp.email" type="email" placeholder="you@example.com" required class="auth-input" />
            </div>
            <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
            <button type="submit" :disabled="loading" class="auth-btn w-full py-3 mt-1" :class="loading ? 'auth-btn-disabled' : ''">
              {{ loading ? 'Sending code…' : 'Send verification code' }}
            </button>
          </form>

          <!-- ── SIGN UP step 2: OTP ── -->
          <div v-else-if="mode === 'otp'" class="text-center">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style="background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.2)">
              <ShieldCheck class="w-7 h-7" style="color:#f97316" />
            </div>
            <h2 class="text-xl font-bold text-white mb-1">Check your email</h2>
            <p class="text-sm text-slate-500 mb-7">Code sent to <span class="font-semibold text-slate-300">{{ signUp.email }}</span></p>

            <div class="flex justify-center gap-2 mb-6">
              <input
                v-for="(_, i) in code" :key="i"
                :ref="el => { if (el) codeRefs[i] = el }"
                v-model="code[i]" type="text" maxlength="1" inputmode="numeric"
                @input="onCodeInput(i)" @keydown.backspace="onBackspace(i)" @paste.prevent="onPaste"
                class="w-11 h-12 text-center text-lg font-bold rounded-xl outline-none transition-all"
                :style="code[i] ? 'background:#0f1f3d;border:2px solid #f97316;color:white' : 'background:#060d1c;border:2px solid #1a2d4d;color:white'"
              />
            </div>

            <p v-if="error" class="text-red-400 text-xs mb-3">{{ error }}</p>
            <button @click="handleVerifyOtp" :disabled="codeValue.length < 5 || loading" class="auth-btn w-full py-3 mb-4" :class="(codeValue.length < 5 || loading) ? 'auth-btn-disabled' : ''">
              {{ loading ? 'Verifying…' : 'Verify code' }}
            </button>
            <p class="text-sm text-slate-500">
              Didn't receive it?
              <button @click="handleResend" :disabled="resendCooldown > 0" class="font-semibold ml-1 transition-colors" :class="resendCooldown > 0 ? 'cursor-not-allowed' : ''" :style="resendCooldown > 0 ? 'color:#334155' : 'color:#f97316'">
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend' }}
              </button>
            </p>
            <button @click="switchMode('signup')" class="mt-5 text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto">
              <ArrowLeft class="w-3 h-3" /> Back
            </button>
          </div>

          <!-- ── SIGN UP step 3: details ── -->
          <form v-else-if="mode === 'details'" @submit.prevent="handleRegister" class="space-y-4">
            <div class="flex items-center gap-2 p-3 rounded-xl mb-1" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2)">
              <CheckCircle class="w-4 h-4 text-emerald-400 shrink-0" />
              <p class="text-xs text-slate-400">Email verified — finish creating your account</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Full name</label>
              <input v-model="signUp.name" type="text" placeholder="John Doe" required class="auth-input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div class="relative">
                <input v-model="signUp.password" :type="showPass ? 'text' : 'password'" placeholder="Min. 8 characters" required class="auth-input pr-10" />
                <button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                  <Eye v-if="!showPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Confirm password</label>
              <div class="relative">
                <input v-model="signUp.confirmPassword" :type="showConfirmPass ? 'text' : 'password'" placeholder="Repeat your password" required class="auth-input pr-10" :style="passwordMismatch ? 'border-color:#ef4444' : ''" />
                <button type="button" @click="showConfirmPass = !showConfirmPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                  <Eye v-if="!showConfirmPass" class="w-4 h-4" /><EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="passwordMismatch" class="text-red-400 text-xs mt-1">Passwords do not match</p>
            </div>
            <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>
            <button type="submit" :disabled="loading || passwordMismatch" class="auth-btn w-full py-3 mt-1" :class="(loading || passwordMismatch) ? 'auth-btn-disabled' : ''">
              {{ loading ? 'Creating account…' : 'Create account' }}
            </button>
          </form>

        </div>

        <p class="text-center text-xs text-slate-700 mt-5">
          By continuing you agree to our
          <a href="#" class="text-slate-500 hover:text-white transition-colors">Terms</a> &amp;
          <a href="#" class="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle } from '@lucide/vue'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import BrandLogo from '@/components/shared/BrandLogo.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

function redirectByRole() {
  const role = authStore.user?.role ?? authStore.user?.roles?.[0]
  if (role === 'ADMIN' || role === 'SUPERADMIN') {
    router.push('/admin/users')
  } else {
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' ? redirect : '/')
  }
}

const mode = ref('signin')
const loading = ref(false)
const error = ref('')
const showPass = ref(false)
const showConfirmPass = ref(false)

const signIn = ref({ email: '', password: '' })
const signUp = ref({ email: '', name: '', password: '', confirmPassword: '' })
const otpToken = ref('')

const passwordMismatch = computed(() =>
  signUp.value.confirmPassword.length > 0 && signUp.value.password !== signUp.value.confirmPassword
)

const code = ref(['', '', '', '', ''])
const codeRefs = ref([])
const codeValue = computed(() => code.value.join(''))
const resendCooldown = ref(0)
let cooldownTimer = null

function startCooldown() {
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => { if (--resendCooldown.value <= 0) clearInterval(cooldownTimer) }, 1000)
}
onUnmounted(() => clearInterval(cooldownTimer))

function switchMode(target) { mode.value = target; error.value = ''; showPass.value = false }

async function handleSendOtp() {
  error.value = ''; loading.value = true
  try { await authApi.sentOtp(signUp.value.email); code.value = ['', '', '', '', '']; mode.value = 'otp'; startCooldown() }
  catch (e) { error.value = e?.response?.data?.message ?? 'Failed to send code.' }
  finally { loading.value = false }
}

async function handleVerifyOtp() {
  error.value = ''; loading.value = true
  try { const res = await authApi.verifyOtp(signUp.value.email, codeValue.value); otpToken.value = res.data?.otpToken ?? res.data?.token ?? res.data; mode.value = 'details' }
  catch (e) { error.value = e?.response?.data?.message ?? 'Invalid or expired code.' }
  finally { loading.value = false }
}

async function handleRegister() {
  if (passwordMismatch.value) return
  error.value = ''; loading.value = true
  try {
    const res = await authApi.register({ name: signUp.value.name, email: signUp.value.email, password: signUp.value.password, role_id: 1, otpToken: otpToken.value })
    authStore.setTokens(res.data.access_token, res.data.refresh_token)
    await Promise.all([authStore.fetchMe(), authStore.fetchOrderToken('CUSTOMER')])
    redirectByRole()
  } catch (e) { error.value = e?.response?.data?.message ?? 'Registration failed.' }
  finally { loading.value = false }
}

async function handleSignIn() {
  error.value = ''; loading.value = true
  try {
    const res = await authApi.login(signIn.value.email, signIn.value.password)
    authStore.setTokens(res.data.access_token, res.data.refresh_token)
    await authStore.fetchMe()
    const role = authStore.user?.role ?? authStore.user?.roles?.[0]
    const orderRole = (role === 'ADMIN' || role === 'SUPERADMIN') ? 'ADMIN' : 'CUSTOMER'
    await authStore.fetchOrderToken(orderRole)
    redirectByRole()
  } catch (e) { error.value = e?.response?.data?.message ?? 'Invalid email or password.' }
  finally { loading.value = false }
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
function onBackspace(index) { if (!code.value[index] && index > 0) codeRefs.value[index - 1]?.focus() }
function onPaste(e) {
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
  text.split('').forEach((char, i) => { code.value[i] = char })
  codeRefs.value[Math.min(text.length, 4)]?.focus()
}
</script>

<style scoped>
.auth-input {
  width: 100%;
  padding: 0.65rem 0.875rem;
  background: #060d1c;
  border: 1px solid #1a2d4d;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
.auth-input:focus { border-color: #f97316; }
.auth-input::placeholder { color: #334155; }

.auth-btn {
  background: #f97316;
  color: #000;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.75rem;
  transition: opacity 0.2s, transform 0.1s;
}
.auth-btn:hover:not(.auth-btn-disabled) { opacity: 0.88; }
.auth-btn:active:not(.auth-btn-disabled) { transform: scale(0.98); }
.auth-btn-disabled { background: #1a2d4d; color: #334155; cursor: not-allowed; }
</style>

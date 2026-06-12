<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)
const profileMenuOpen = ref(false)
const themeMode = ref<'light' | 'dark'>('light')

const isActiveRoute = (routeName: string) => {
  return router.currentRoute.value.name === routeName
}

const handleLogout = () => {
  authStore.clearAuth()
  menuOpen.value = false
  profileMenuOpen.value = false
  router.push({ name: 'login' })
}

const closeMenu = () => {
  menuOpen.value = false
  profileMenuOpen.value = false
}

const displayName = () => {
  return authStore.participant?.nickname || authStore.participant?.name || authStore.participant?.email
}

const applyTheme = (mode: 'light' | 'dark') => {
  themeMode.value = mode
  document.body.classList.toggle('dark-theme', mode === 'dark')
  localStorage.setItem('theme-mode', mode)
}

const setLightTheme = () => {
  applyTheme('light')
}

const setDarkTheme = () => {
  applyTheme('dark')
}

const goHome = () => {
  profileMenuOpen.value = false
  menuOpen.value = false
  router.push({ name: 'home' })
}

const openUserArea = () => {
  profileMenuOpen.value = false
  menuOpen.value = false
  router.push({ name: 'meus-palpites' })
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

onMounted(() => {
  const storedTheme = localStorage.getItem('theme-mode')
  applyTheme(storedTheme === 'dark' ? 'dark' : 'light')
})
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <button class="logo" @click="goHome" aria-label="Ir para a página principal">
        <div class="logo-icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <span class="logo-text">Bolão Copa 2026</span>
      </button>

      <nav class="desktop-nav">
        <router-link to="/palpites" :class="['nav-link', isActiveRoute('palpites') && 'nav-link--active']">
          Palpites
        </router-link>
        <router-link to="/ranking" :class="['nav-link', isActiveRoute('ranking') && 'nav-link--active']">
          Ranking
        </router-link>
      </nav>

      <div class="theme-toggle" aria-label="Alternar tema">
        <button
          class="theme-toggle-button"
          :class="{ 'theme-toggle-button--active': themeMode === 'light' }"
          @click="setLightTheme"
          title="Modo claro"
          aria-label="Modo claro"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>
        <button
          class="theme-toggle-button"
          :class="{ 'theme-toggle-button--active': themeMode === 'dark' }"
          @click="setDarkTheme"
          title="Modo escuro"
          aria-label="Modo escuro"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646a9 9 0 1011.708 11.708z" />
          </svg>
        </button>
      </div>

      <div class="desktop-user">
        <button class="profile-trigger" :class="{ 'profile-trigger--active': profileMenuOpen }" @click="toggleProfileMenu" title="Abrir área do usuário">
          <span class="avatar-circle">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <span class="profile-name">{{ displayName() }}</span>
          <svg class="profile-chevron" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="profileMenuOpen" class="profile-menu">
          <div class="profile-menu-head">
            <span class="profile-menu-title">{{ displayName() }}</span>
            <span class="profile-menu-subtitle">{{ authStore.participant?.email }}</span>
          </div>

          <button class="profile-menu-link" @click="openUserArea">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14l9 5H3l9-5z" />
            </svg>
            Meus dados e palpites
          </button>

          <button @click="handleLogout" class="profile-menu-link profile-menu-link--danger">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </div>

      <button
        class="hamburger"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Menu"
      >
        <span :class="['bar', menuOpen && 'bar--open-top']"></span>
        <span :class="['bar', menuOpen && 'bar--open-mid']"></span>
        <span :class="['bar', menuOpen && 'bar--open-bot']"></span>
      </button>
    </div>
  </header>

  <button v-if="profileMenuOpen" class="profile-backdrop" @click="profileMenuOpen = false" aria-label="Fechar menu do usuário"></button>

  <transition name="fade">
    <div v-if="menuOpen" class="overlay" @click="closeMenu" />
  </transition>

  <transition name="slide-up">
    <div v-if="menuOpen" class="drawer">
      <div class="drawer-handle" />

      <button class="drawer-user drawer-user--button" @click="openUserArea">
        <div class="drawer-avatar">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="drawer-user-copy">
          <span class="drawer-email">{{ displayName() }}</span>
          <span class="drawer-user-label">Meus dados e palpites</span>
        </div>
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div class="drawer-divider" />

      <nav class="drawer-nav">
        <router-link
          to="/home"
          :class="['drawer-link', isActiveRoute('home') && 'drawer-link--active']"
          @click="closeMenu"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Início
        </router-link>
        <router-link
          to="/palpites"
          :class="['drawer-link', isActiveRoute('palpites') && 'drawer-link--active']"
          @click="closeMenu"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Palpites
        </router-link>
        <router-link
          to="/ranking"
          :class="['drawer-link', isActiveRoute('ranking') && 'drawer-link--active']"
          @click="closeMenu"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Ranking
        </router-link>
      </nav>

      <div class="drawer-divider" />

      <button @click="handleLogout" class="drawer-logout">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sair
      </button>
    </div>
  </transition>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  max-width: 42rem;
  margin: 0 auto;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.logo-icon {
  width: 32px;
  height: 32px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}
.logo-text {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}
.desktop-nav {
  display: none;
}
.desktop-user {
  display: none;
}
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}
.theme-toggle-button {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.theme-toggle-button:hover {
  background: #f3f4f6;
}
.theme-toggle-button--active {
  background: #16a34a;
  color: #fff;
}
@media (min-width: 640px) {
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .desktop-user {
    display: flex;
    align-items: center;
    position: relative;
  }
  .hamburger {
    display: none !important;
  }
}
.nav-link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}
.nav-link--active {
  background: #16a34a;
  color: #fff !important;
}
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px 5px 5px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  color: #4b5563;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  position: relative;
  z-index: 46;
}
.profile-trigger:hover,
.profile-trigger--active {
  background: #f3f4f6;
  border-color: #d1d5db;
}
.avatar-circle {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  flex-shrink: 0;
}
.profile-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-chevron {
  color: #9ca3af;
  flex-shrink: 0;
}
.profile-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
  padding: 10px;
  z-index: 46;
}
.profile-menu-head {
  padding: 8px 10px 10px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.profile-menu-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.profile-menu-subtitle {
  font-size: 11px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-menu-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: none;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}
.profile-menu-link:hover {
  background: #f9fafb;
}
.profile-menu-link--danger {
  color: #b91c1c;
}
.profile-menu-link--danger:hover {
  background: #fef2f2;
}
.profile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 45;
  border: none;
  background: transparent;
}
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
}
.hamburger:hover {
  background: #f3f4f6;
}
.bar {
  display: block;
  width: 20px;
  height: 2px;
  background: #374151;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
  transform-origin: center;
}
.bar--open-top { transform: translateY(7px) rotate(45deg); }
.bar--open-mid { opacity: 0; transform: scaleX(0); }
.bar--open-bot { transform: translateY(-7px) rotate(-45deg); }
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 48;
}
.drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 49;
  background: #fff;
  border-radius: 20px 20px 0 0;
  padding: 8px 0 32px;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
}
.drawer-handle {
  width: 36px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 4px auto 16px;
}
.drawer-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 20px 12px;
}
.drawer-user--button {
  width: 100%;
  background: none;
  border: none;
  text-align: left;
  justify-content: space-between;
  cursor: pointer;
}
.drawer-avatar {
  width: 36px;
  height: 36px;
  background: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  flex-shrink: 0;
}
.drawer-user-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}
.drawer-email {
  font-size: 13px;
  color: #111827;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.drawer-user-label {
  font-size: 12px;
  color: #6b7280;
}
.drawer-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}
.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 4px 12px;
}
.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 12px;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  border-radius: 10px;
  transition: background 0.15s, color 0.15s;
}
.drawer-link:hover {
  background: #f9fafb;
}
.drawer-link--active {
  background: #f0fdf4;
  color: #16a34a;
}
.drawer-logout {
  display: flex;
  align-items: center;
  gap: 12px;
  width: calc(100% - 24px);
  margin: 4px 12px 0;
  padding: 13px 12px;
  font-size: 15px;
  font-weight: 500;
  color: #ef4444;
  background: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.drawer-logout:hover {
  background: #fef2f2;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.22s ease-in; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>

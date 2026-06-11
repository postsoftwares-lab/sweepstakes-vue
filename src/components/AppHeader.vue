<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)

const isActiveRoute = (routeName: string) => {
  return router.currentRoute.value.name === routeName
}

const handleLogout = () => {
  authStore.clearAuth()
  menuOpen.value = false
  router.push({ name: 'login' })
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <span class="logo-text">Bolão Copa 2026</span>
      </div>

      <!-- Desktop Nav -->
      <nav class="desktop-nav">
        <router-link to="/palpites" :class="['nav-link', isActiveRoute('palpites') && 'nav-link--active']">
          Palpites
        </router-link>
        <router-link to="/ranking" :class="['nav-link', isActiveRoute('ranking') && 'nav-link--active']">
          Ranking
        </router-link>
      </nav>

      <!-- Desktop user info -->
      <div class="desktop-user">
        <div class="user-email">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{{ authStore.participant?.email }}</span>
        </div>
        <button @click="handleLogout" class="logout-btn" title="Sair">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <!-- Hamburger button (mobile only) -->
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

  <!-- Overlay -->
  <transition name="fade">
    <div v-if="menuOpen" class="overlay" @click="closeMenu" />
  </transition>

  <!-- Drawer mobile -->
  <transition name="slide-up">
    <div v-if="menuOpen" class="drawer">
      <div class="drawer-handle" />

      <!-- User info -->
      <div class="drawer-user">
        <div class="drawer-avatar">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span class="drawer-email">{{ authStore.participant?.email }}</span>
      </div>

      <div class="drawer-divider" />

      <!-- Nav links -->
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
        <router-link
          to="/meus-palpites"
          :class="['drawer-link', isActiveRoute('meus-palpites') && 'drawer-link--active']"
          @click="closeMenu"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Meus Palpites
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
/* ── Header ────────────────────────────────────────── */
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

/* ── Logo ──────────────────────────────────────────── */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
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

/* ── Desktop nav (hidden on mobile) ───────────────── */
.desktop-nav {
  display: none;
}
.desktop-user {
  display: none;
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
    gap: 8px;
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

.user-email {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 13px;
  color: #4b5563;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logout-btn {
  padding: 6px;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.logout-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

/* ── Hamburger ─────────────────────────────────────── */
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
.bar--open-top  { transform: translateY(7px) rotate(45deg); }
.bar--open-mid  { opacity: 0; transform: scaleX(0); }
.bar--open-bot  { transform: translateY(-7px) rotate(-45deg); }

/* ── Overlay ───────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 48;
}

/* ── Drawer (bottom sheet mobile) ─────────────────── */
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
.drawer-email {
  font-size: 13px;
  color: #4b5563;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* ── Transitions ───────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-up-enter-active { transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-leave-active { transition: transform 0.22s ease-in; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>

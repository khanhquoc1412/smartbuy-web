<template>
  <div 
    v-if="isOpen" 
    @click.stop
    class="tw-fixed tw-right-0 tw-top-0 tw-bottom-0 tw-w-[420px] tw-bg-white tw-shadow-2xl tw-z-[9999] tw-flex tw-flex-col tw-animate-slideIn"
  >
    <!-- Header -->
    <div class="tw-bg-gradient-to-r tw-from-slate-800 tw-to-slate-900 tw-px-6 tw-py-5 tw-flex tw-items-center tw-justify-between tw-border-b tw-border-slate-700">
      <div class="tw-flex tw-items-center tw-gap-3">
        <div class="tw-w-10 tw-h-10 tw-bg-white/10 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
          <svg class="tw-w-6 tw-h-6 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 class="tw-text-white tw-font-bold tw-text-lg">DashboardKit Customizer</h2>
      </div>
      <button 
        @click="$emit('close')"
        class="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-lg hover:tw-bg-white/10 tw-transition-colors"
      >
        <svg class="tw-w-5 tw-h-5 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="tw-flex-1 tw-overflow-y-auto tw-px-6 tw-py-6 tw-space-y-8">
      
      <!-- Theme Mode -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Theme Mode</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Choose light or dark mode or Auto</p>
        <div class="tw-grid tw-grid-cols-3 tw-gap-3">
          <button
            v-for="mode in themeModes"
            :key="mode.value"
            @click="settings.themeMode = mode.value"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all tw-group',
              settings.themeMode === mode.value
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300 hover:tw-bg-slate-50'
            ]"
          >
            <div class="tw-flex tw-flex-col tw-items-center tw-gap-2">
              <div :class="[
                'tw-w-12 tw-h-12 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-text-2xl',
                settings.themeMode === mode.value ? 'tw-bg-blue-100' : 'tw-bg-slate-100'
              ]">
                {{ mode.icon }}
              </div>
              <span class="tw-text-xs tw-font-semibold tw-text-slate-700">{{ mode.label }}</span>
            </div>
            <div v-if="settings.themeMode === mode.value" class="tw-absolute tw-top-2 tw-right-2">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Accent Color -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Accent color</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Choose your primary theme color</p>
        <div class="tw-grid tw-grid-cols-5 tw-gap-3">
          <button
            v-for="color in accentColors"
            :key="color.value"
            @click="settings.accentColor = color.value"
            :class="[
              'tw-relative tw-w-full tw-h-14 tw-rounded-xl tw-transition-all hover:tw-scale-110',
              settings.accentColor === color.value ? 'tw-ring-4 tw-ring-slate-900 tw-ring-offset-2' : ''
            ]"
            :style="{ backgroundColor: color.hex }"
            :title="color.name"
          >
            <div v-if="settings.accentColor === color.value" class="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
              <svg class="tw-w-6 tw-h-6 tw-text-white tw-drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Sidebar Theme -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Sidebar Theme</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Choose Sidebar Theme</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <button
            v-for="theme in ['dark', 'light']"
            :key="theme"
            @click="settings.sidebarTheme = theme"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all',
              settings.sidebarTheme === theme
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300'
            ]"
          >
            <div class="tw-space-y-2">
              <div :class="[
                'tw-h-20 tw-rounded-lg',
                theme === 'dark' ? 'tw-bg-slate-900' : 'tw-bg-white tw-border-2 tw-border-slate-200'
              ]"></div>
              <p class="tw-text-xs tw-font-semibold tw-text-slate-700 tw-text-center tw-capitalize">{{ theme }}</p>
            </div>
            <div v-if="settings.sidebarTheme === theme" class="tw-absolute tw-top-3 tw-right-3">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Sidebar Caption -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Sidebar Caption</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Sidebar Caption Hide/Show</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <button
            v-for="option in [{value: true, label: 'Caption Show'}, {value: false, label: 'Caption Hide'}]"
            :key="option.label"
            @click="settings.sidebarCaption = option.value"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all',
              settings.sidebarCaption === option.value
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300'
            ]"
          >
            <div class="tw-space-y-2">
              <div class="tw-bg-slate-900 tw-rounded-lg tw-p-3 tw-space-y-1">
                <div v-if="option.value" class="tw-h-2 tw-bg-slate-500 tw-rounded tw-w-1/2 tw-mb-2"></div>
                <div class="tw-h-2 tw-bg-slate-600 tw-rounded"></div>
                <div class="tw-h-2 tw-bg-slate-600 tw-rounded"></div>
                <div class="tw-h-2 tw-bg-slate-600 tw-rounded"></div>
              </div>
              <p class="tw-text-xs tw-font-semibold tw-text-slate-700 tw-text-center">{{ option.label }}</p>
            </div>
            <div v-if="settings.sidebarCaption === option.value" class="tw-absolute tw-top-3 tw-right-3">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Header Theme -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Header Theme</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Choose Header Theme</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <button
            v-for="theme in ['dark', 'light']"
            :key="theme"
            @click="settings.headerTheme = theme"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all',
              settings.headerTheme === theme
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300'
            ]"
          >
            <div class="tw-space-y-2">
              <div :class="[
                'tw-h-10 tw-rounded-lg',
                theme === 'dark' ? 'tw-bg-slate-900' : 'tw-bg-white tw-border-2 tw-border-slate-200'
              ]"></div>
              <p class="tw-text-xs tw-font-semibold tw-text-slate-700 tw-text-center tw-capitalize">{{ theme }}</p>
            </div>
            <div v-if="settings.headerTheme === theme" class="tw-absolute tw-top-3 tw-right-3">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Theme Layout -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Theme Layout</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">LTR/RTL</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <button
            v-for="direction in ['ltr', 'rtl']"
            :key="direction"
            @click="settings.layoutDirection = direction"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all',
              settings.layoutDirection === direction
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300'
            ]"
          >
            <div class="tw-space-y-2">
              <div class="tw-flex tw-gap-2">
                <div :class="[
                  'tw-h-16 tw-rounded-lg tw-bg-slate-900',
                  direction === 'ltr' ? 'tw-w-1/3' : 'tw-w-1/3 tw-order-2'
                ]"></div>
                <div :class="[
                  'tw-flex-1 tw-h-16 tw-rounded-lg tw-bg-slate-200',
                  direction === 'rtl' ? 'tw-order-1' : ''
                ]"></div>
              </div>
              <p class="tw-text-xs tw-font-semibold tw-text-slate-700 tw-text-center tw-uppercase">{{ direction }}</p>
            </div>
            <div v-if="settings.layoutDirection === direction" class="tw-absolute tw-top-3 tw-right-3">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Layout Width -->
      <div>
        <h3 class="tw-text-sm tw-font-bold tw-text-slate-900 tw-mb-1">Layout Width</h3>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-4">Choose Full or Container Layout</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-3">
          <button
            v-for="width in [{value: 'full', label: 'Full Width'}, {value: 'boxed', label: 'Fixed Width'}]"
            :key="width.value"
            @click="settings.layoutWidth = width.value"
            :class="[
              'tw-relative tw-border-2 tw-rounded-xl tw-p-4 tw-transition-all',
              settings.layoutWidth === width.value
                ? 'tw-border-blue-600 tw-bg-blue-50'
                : 'tw-border-slate-200 hover:tw-border-slate-300'
            ]"
          >
            <div class="tw-space-y-2">
              <div class="tw-bg-slate-100 tw-rounded-lg tw-p-2 tw-flex tw-justify-center">
                <div :class="[
                  'tw-h-16 tw-rounded tw-bg-slate-400',
                  width.value === 'full' ? 'tw-w-full' : 'tw-w-3/4'
                ]"></div>
              </div>
              <p class="tw-text-xs tw-font-semibold tw-text-slate-700 tw-text-center">{{ width.label }}</p>
            </div>
            <div v-if="settings.layoutWidth === width.value" class="tw-absolute tw-top-3 tw-right-3">
              <svg class="tw-w-5 tw-h-5 tw-text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
      </div>

    </div>

    <!-- Footer Actions -->
    <div class="tw-px-6 tw-py-4 tw-bg-slate-50 tw-border-t tw-border-slate-200 tw-flex tw-gap-3">
      <button 
        @click="handleReset"
        class="tw-flex-1 tw-px-4 tw-py-3 tw-bg-white tw-border-2 tw-border-slate-300 tw-rounded-xl tw-font-semibold tw-text-slate-700 hover:tw-bg-slate-100 tw-transition-all tw-text-sm"
      >
        Reset Layout
      </button>
      <button 
        @click="handleSave"
        class="tw-flex-1 tw-px-4 tw-py-3 tw-bg-blue-600 tw-rounded-xl tw-font-semibold tw-text-white hover:tw-bg-blue-700 tw-transition-all tw-text-sm tw-shadow-lg tw-shadow-blue-600/30"
      >
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const themeModes = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'auto', label: 'Default', icon: '⚙️' }
]

const accentColors = [
  { name: 'Indigo', value: 'indigo', hex: '#4F46E5' },
  { name: 'Purple', value: 'purple', hex: '#7C3AED' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Rose', value: 'rose', hex: '#F43F5E' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
  { name: 'Amber', value: 'amber', hex: '#F59E0B' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Teal', value: 'teal', hex: '#14B8A6' },
  { name: 'Cyan', value: 'cyan', hex: '#06B6D4' },
  { name: 'Red', value: 'red', hex: '#DC2626' }
]

// Load settings from localStorage
const settings = reactive({
  themeMode: localStorage.getItem('themeMode') || 'light',
  accentColor: localStorage.getItem('accentColor') || 'indigo',
  sidebarTheme: localStorage.getItem('sidebarTheme') || 'light',
  sidebarCaption: localStorage.getItem('sidebarCaption') !== 'false',
  headerTheme: localStorage.getItem('headerTheme') || 'dark',
  layoutDirection: localStorage.getItem('layoutDirection') || 'ltr',
  layoutWidth: localStorage.getItem('layoutWidth') || 'full'
})

// Apply settings immediately (live preview)
watch(settings, (newSettings) => {
  applySettings(newSettings)
}, { deep: true })

function applySettings(config) {
  // Apply theme mode
  if (config.themeMode === 'dark') {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
  
  // Apply accent color
  const colorHex = accentColors.find(c => c.value === config.accentColor)?.hex || '#4F46E5'
  document.documentElement.style.setProperty('--primary-color', colorHex)
  
  // Apply sidebar theme
  document.documentElement.setAttribute('data-sidebar-theme', config.sidebarTheme)
  
  // Apply header theme
  document.documentElement.setAttribute('data-header-theme', config.headerTheme)
  
  // Apply layout direction
  document.documentElement.setAttribute('dir', config.layoutDirection)
  
  // Apply layout width
  document.documentElement.setAttribute('data-layout-width', config.layoutWidth)
}

function handleSave() {
  // Save to localStorage
  Object.keys(settings).forEach(key => {
    localStorage.setItem(key, settings[key])
  })
  
  emit('save', settings)
  emit('close')
  
  // Show success notification
  alert('✅ Settings saved successfully!')
}

function handleReset() {
  settings.themeMode = 'light'
  settings.accentColor = 'indigo'
  settings.sidebarTheme = 'light'
  settings.sidebarCaption = true
  settings.headerTheme = 'dark'
  settings.layoutDirection = 'ltr'
  settings.layoutWidth = 'full'
  
  handleSave()
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.tw-animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

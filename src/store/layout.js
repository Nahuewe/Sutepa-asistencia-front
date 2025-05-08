import { createSlice } from '@reduxjs/toolkit'

import themeConfig from '@/configs/themeConfig'

const initialDarkMode = () => {
  const item = window.localStorage.getItem('darkMode')
  return item ? JSON.parse(item) : themeConfig.layout.darkMode
}

const initialSidebarCollapsed = () => {
  const item = window.localStorage.getItem('sidebarCollapsed')
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialSemiDarkMode = () => {
  const item = window.localStorage.getItem('semiDarkMode')
  return item ? JSON.parse(item) : themeConfig.layout.semiDarkMode
}

const initialRtl = () => {
  const item = window.localStorage.getItem('direction')
  return item ? JSON.parse(item) : themeConfig.layout.isRTL
}

const initialSkin = () => {
  const item = window.localStorage.getItem('skin')
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

const initialType = () => {
  const item = window.localStorage.getItem('type')
  return item ? JSON.parse(item) : themeConfig.layout.type
}

const initialState = {
  isRTL: initialRtl(),
  darkMode: initialDarkMode(),
  isCollapsed: initialSidebarCollapsed(),
  customizer: themeConfig.layout.customizer,
  semiDarkMode: initialSemiDarkMode(),
  skin: initialSkin(),
  contentWidth: themeConfig.layout.contentWidth,
  type: initialType(),
  menuHidden: themeConfig.layout.menu.isHidden,
  navBarType: themeConfig.layout.navBarType,
  footerType: themeConfig.layout.footerType,
  mobileMenu: themeConfig.layout.mobileMenu,
  showModal: false,
  showDeleteModal: false
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {

    handleDarkMode: (state, action) => {
      state.darkMode = action.payload
      window.localStorage.setItem('darkMode', action.payload)
    },

    handleSidebarCollapsed: (state, action) => {
      state.isCollapsed = action.payload
      window.localStorage.setItem('sidebarCollapsed', action.payload)
    },

    handleCustomizer: (state, action) => {
      state.customizer = action.payload
    },

    handleSemiDarkMode: (state, action) => {
      state.semiDarkMode = action.payload
      window.localStorage.setItem('semiDarkMode', action.payload)
    },

    handleRtl: (state, action) => {
      state.isRTL = action.payload
      window.localStorage.setItem('direction', JSON.stringify(action.payload))
    },

    handleSkin: (state, action) => {
      state.skin = action.payload
      window.localStorage.setItem('skin', JSON.stringify(action.payload))
    },

    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload
    },

    handleType: (state, action) => {
      state.type = action.payload
      window.localStorage.setItem('type', JSON.stringify(action.payload))
    },

    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload
    },

    handleNavBarType: (state, action) => {
      state.navBarType = action.payload
    },

    handleFooterType: (state, action) => {
      state.footerType = action.payload
    },

    handleMobileMenu: (state, action) => {
      state.mobileMenu = action.payload
    },

    handleShowModal: (state) => {
      state.showModal = !state.showModal
    },

    handleShowEdit: (state) => {
      state.showEdit = !state.showEdit
    },

    handleShowDelete: (state) => {
      state.showDelete = !state.showDelete
    },

    handleShowAuxModal: (state) => {
      state.showAuxModal = !state.showAuxModal
    },

    handleShowConfirm: (state) => {
      state.showConfirm = !state.showConfirm
    }
  }
})

export const {
  handleDarkMode,
  handleSidebarCollapsed,
  handleCustomizer,
  handleSemiDarkMode,
  handleRtl,
  handleSkin,
  handleContentWidth,
  handleType,
  handleMenuHidden,
  handleNavBarType,
  handleFooterType,
  handleMobileMenu,
  handleShowModal,
  handleShowEdit,
  handleShowDelete,
  handleShowAuxModal,
  handleShowConfirm
} = layoutSlice.actions

export default layoutSlice.reducer

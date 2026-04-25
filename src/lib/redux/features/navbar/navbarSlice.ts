import { createSlice } from '@reduxjs/toolkit'

interface NavbarState {
  isSidebarOpen: boolean
}

const initialState: NavbarState = {
  isSidebarOpen: false
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false
    }
  }
})

export const { toggleSidebar, closeSidebar } = navbarSlice.actions
export default navbarSlice.reducer

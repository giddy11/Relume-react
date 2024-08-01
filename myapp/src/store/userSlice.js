import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  user: null,
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true
    },
    setUserDetails: (state, action) => {
      console.log("from userslice: ", action.payload)
      state.user = action.payload
      state.isLoading = false
    },
    setLoadingFailed: (state) => {
      state.isLoading = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { setLoading, setUserDetails, setLoadingFailed } = userSlice.actions
  
  export default userSlice.reducer
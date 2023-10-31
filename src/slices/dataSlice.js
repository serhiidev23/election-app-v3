import { createSlice } from '@reduxjs/toolkit'

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    year: 0,
    polling_centres_json: null,
    results: {},
    whole_results: {}
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload
    },
    setResults: (state, action) => {
      state.results = action.payload
    },
    setWholeResults: (state, action) => {
      state.whole_results = action.payload
    },
    setPollingCentresJson: (state, action) => {
      state.polling_centres_json = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setYear, setWholeResults, setPollingCentresJson, setResults } = dataSlice.actions
export const dataSelector = state => state.data;

export default dataSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';

const initialState = {
  properties: [],
  property: null,
  myProperties: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    count: 0,
  },
};

// Get all properties
export const getProperties = createAsyncThunk(
  'properties/getAll',
  async (filters, thunkAPI) => {
    try {
      return await propertyService.getProperties(filters);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get property by ID
export const getPropertyById = createAsyncThunk(
  'properties/getById',
  async (id, thunkAPI) => {
    try {
      return await propertyService.getPropertyById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my properties (landlord)
export const getMyProperties = createAsyncThunk(
  'properties/getMy',
  async (_, thunkAPI) => {
    try {
      return await propertyService.getMyProperties();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create property
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, thunkAPI) => {
    try {
      return await propertyService.createProperty(propertyData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update property
export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, propertyData }, thunkAPI) => {
    try {
      return await propertyService.updateProperty(id, propertyData);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete property
export const deleteProperty = createAsyncThunk(
  'properties/delete',
  async (id, thunkAPI) => {
    try {
      return await propertyService.deleteProperty(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all properties
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.properties;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          count: action.payload.count,
        };
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get property by ID
      .addCase(getPropertyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload.property;
      })
      .addCase(getPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my properties
      .addCase(getMyProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myProperties = action.payload.properties;
      })
      .addCase(getMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myProperties.push(action.payload.property);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update property
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.myProperties.findIndex(p => p._id === action.payload.property._id);
        if (index !== -1) {
          state.myProperties[index] = action.payload.property;
        }
      })
      // Delete property
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.myProperties = state.myProperties.filter(p => p._id !== action.meta.arg);
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;

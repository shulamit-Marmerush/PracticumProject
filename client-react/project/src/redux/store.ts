import { createStore } from 'redux';

interface Photo {
  Url: string;
  Title: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface State {
  uploadedPhotos: Photo[];
}

const initialState: State = {
  uploadedPhotos: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'ADD_PHOTO':
      return {
        ...state,
        uploadedPhotos: [...state.uploadedPhotos, action.payload],
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;

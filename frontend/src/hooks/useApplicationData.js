import { useState, useReducer, useEffect } from "react";
import photos from "mocks/photos";
import topics from "mocks/topics";

const INITIAL_STATE = {
  selectedPhoto: undefined,
  favPhotoIds: [],
  photos: [],
  filteredPhotos: [],
  topics: [],
  topic: undefined,
};

export const ACTIONS = {
  SWITCH_LIKE: "switch_like",
  SHOW_LIKED: "show_liked",
  SWITCH_TOPIC: "switch_topic",
  SELECT_PHOTO: "select_photo",
  CLOSE_MODAL: "close_modal",
  SET_PHOTO_DATA: "set_photo_data"
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SWITCH_LIKE:
      return {
        ...state,
        favPhotoIds: state.favPhotoIds.includes(action.payload)
          ? state.favPhotoIds.filter((id) => id !== action.payload)
          : [...state.favPhotoIds, action.payload]
      };
    case ACTIONS.SELECT_PHOTO:
      return {
        ...state,
        selectedPhoto: action.payload
      };
    case ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        selectedPhoto: undefined
      };
    case ACTIONS.SHOW_LIKED:
      return {
        ...state,
        filteredPhotos: state.photos.filter((p) => state.favPhotoIds.includes(p.id))
      };
    case ACTIONS.SWITCH_TOPIC:
      return {
        ...state,
        topic: action.payload,
        filteredPhotos: state.photos.filter((photo) => photo.topics.includes(action.payload))
      };

    case ACTIONS.SET_PHOTO_DATA:
      return {
        ...state, 
        photos: action.payload,
        filteredPhotos: action.payload
      }
    default:
      throw new Error(`Could not perform unknown action: ${action.type}, payload: ${action.payload}`)
  }
};

const useApplicationData = () => {
  // Define your state variables
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const showLiked = () => dispatch({type: ACTIONS.SHOW_LIKED})

  // Define your actions
  const updateToFavPhotoIds = (photoId) => {
   dispatch({type: ACTIONS.SWITCH_LIKE, payload: photoId})
  };

  const setPhotoSelected = (photo) => {
    dispatch({type: ACTIONS.SELECT_PHOTO, payload: photo})
  };

  const onLoadTopic = (topic) => {
    dispatch({type: ACTIONS.SWITCH_TOPIC, payload: topic})
  };

  const onClosePhotoDetailsModal = () => {
    dispatch({type: ACTIONS.CLOSE_MODAL})
  };

  const setPhotoData = (photos) => {
    dispatch({type: ACTIONS.SET_PHOTO_DATA, payload: photos})
  }

  return {
    state,
    dispatch,
  };
};

export default useApplicationData;

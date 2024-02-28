import { useState, useReducer, useEffect } from "react";

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
  SET_PHOTO_DATA: "set_photo_data",
  SET_TOPICS_DATA: "set_topics_data",
  SET_FILTERED_PHOTOS: "set_filtered_photos",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SWITCH_LIKE:
      return {
        ...state,
        favPhotoIds: state.favPhotoIds.includes(action.payload)
          ? state.favPhotoIds.filter((id) => id !== action.payload)
          : [...state.favPhotoIds, action.payload],
      };
    case ACTIONS.SELECT_PHOTO:
      return {
        ...state,
        selectedPhoto: action.payload,
      };
    case ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        selectedPhoto: undefined,
      };
    case ACTIONS.SHOW_LIKED:
      return {
        ...state,
        filteredPhotos: state.photos.filter((p) =>
          state.favPhotoIds.includes(p.id)
        ),
      };
    case ACTIONS.SWITCH_TOPIC:
      return {
        ...state,
        topic: action.payload,
      };
    case ACTIONS.SET_PHOTO_DATA:
      return {
        ...state,
        photos: action.payload,
        filteredPhotos: action.payload,
      };
    case ACTIONS.SET_TOPICS_DATA:
      return {
        ...state,
        topics: action.payload,
      };
    case ACTIONS.SET_FILTERED_PHOTOS:
      return {
        ...state,
        filteredPhotos: action.payload
      }
    default:
      throw new Error(
        `Could not perform unknown action: ${action.type}, payload: ${action.payload}`
      );
  }
};

const useApplicationData = () => {
  // Define your state variables
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    fetch("/api/photos", { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch photos");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({ type: ACTIONS.SET_PHOTO_DATA, payload: data });
      })
      .catch((error) => {
        console.error("Error fetching photos:", error.message);
      });

    fetch("/api/topics", { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch topics");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({ type: ACTIONS.SET_TOPICS_DATA, payload: data });
      })
      .catch((error) => {
        console.error("Error fetching topics:", error.message);
      });
  }, []);

  useEffect(() => {
    if(!state.topic) return
    fetch(`/api/topics/photos/${state.topic.id}`)
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: ACTIONS.SET_FILTERED_PHOTOS, payload: data })
      );
  }, [state.topic]);

  const showLiked = () => dispatch({ type: ACTIONS.SHOW_LIKED });

  return {
    state,
    dispatch,
  };
};

export default useApplicationData;
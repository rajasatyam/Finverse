import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const STORAGE_PREFIX = "fined_learning_progress_";

/**
 * Get progress data from localStorage
 */
export const getLocalProgress = (playlistId) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${playlistId}`);
    if (!raw) return { completedIds: [], watchedIds: [], lastWatchedId: null };
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read progress from localStorage:", e);
    return { completedIds: [], watchedIds: [], lastWatchedId: null };
  }
};

/**
 * Save progress data to localStorage and sync to Firestore if user is logged in
 */
export const saveProgress = async (playlistId, progressData) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${playlistId}`, JSON.stringify(progressData));

    // If authenticated, sync with Firestore in background
    const user = auth.currentUser;
    if (user && user.uid) {
      try {
        const userProgressRef = doc(db, "users", user.uid, "learningProgress", playlistId);
        await setDoc(userProgressRef, {
          ...progressData,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn("Firestore progress sync failed, local progress preserved:", firestoreErr);
      }
    }
  } catch (e) {
    console.error("Failed to save learning progress:", e);
  }
};

/**
 * Load progress: checks Firestore if user is logged in, merges with localStorage
 */
export const fetchUserProgress = async (playlistId) => {
  const local = getLocalProgress(playlistId);
  const user = auth.currentUser;

  if (!user || !user.uid) {
    return local;
  }

  try {
    const userProgressRef = doc(db, "users", user.uid, "learningProgress", playlistId);
    const snap = await getDoc(userProgressRef);
    if (snap.exists()) {
      const remote = snap.data();
      // Merge unique IDs
      const merged = {
        completedIds: Array.from(new Set([...(local.completedIds || []), ...(remote.completedIds || [])])),
        watchedIds: Array.from(new Set([...(local.watchedIds || []), ...(remote.watchedIds || [])])),
        lastWatchedId: remote.lastWatchedId || local.lastWatchedId || null
      };
      localStorage.setItem(`${STORAGE_PREFIX}${playlistId}`, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn("Could not fetch remote progress, using local:", err);
  }

  return local;
};

/**
 * Toggle completed state for a video
 */
export const toggleVideoCompletion = async (playlistId, videoId) => {
  const current = getLocalProgress(playlistId);
  const completedSet = new Set(current.completedIds || []);

  if (completedSet.has(videoId)) {
    completedSet.delete(videoId);
  } else {
    completedSet.add(videoId);
  }

  const updated = {
    ...current,
    completedIds: Array.from(completedSet)
  };

  await saveProgress(playlistId, updated);
  return updated;
};

/**
 * Mark a video as watched and update lastWatchedId
 */
export const markVideoWatched = async (playlistId, videoId) => {
  const current = getLocalProgress(playlistId);
  const watchedSet = new Set(current.watchedIds || []);
  watchedSet.add(videoId);

  const updated = {
    ...current,
    watchedIds: Array.from(watchedSet),
    lastWatchedId: videoId
  };

  await saveProgress(playlistId, updated);
  return updated;
};


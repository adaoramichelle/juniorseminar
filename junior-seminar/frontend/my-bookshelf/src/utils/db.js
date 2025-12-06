import { openDB } from "idb";
import { toast } from 'react-toastify';
const DB_NAME = "my-bookshelf";
const STORE_NAME = 'homepageBooks';
const SHELVES_STORE = 'shelves';
const QUEUE_STORE = 'offlineQueue'
const RECOMMEND_STORE = 'recommendations';
export const initDB = async () => {
    return openDB(DB_NAME, 3, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
            if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                db.createObjectStore(QUEUE_STORE, { autoIncrement: true })
            }
            if (!db.objectStoreNames.contains(SHELVES_STORE)) {
                db.createObjectStore(SHELVES_STORE);
            }
            if (!db.objectStoreNames.contains(RECOMMEND_STORE)) {
                db.createObjectStore(RECOMMEND_STORE);
            }
        }
    })

}
export async function saveBookshelvesData(data) {
    const db = await initDB();
    const tx = db.transaction(SHELVES_STORE, 'readwrite');
    await tx.store.put(data, 'bookshelves');
    await tx.done;
}
export async function getBookshelvesData() {
    const db = await initDB();
    const tx = db.transaction(SHELVES_STORE, 'readonly');
    const data = await tx.store.get('bookshelves');
    await tx.done;
    return data || null;
}

export async function saveRecs(data) {
    const db = await initDB();
    const tx = db.transaction(RECOMMEND_STORE, 'readwrite');
    await tx.store.put(data, 'recommendations');
    await tx.done;
}

export async function getRecs() {
    const db = await initDB();
    const tx = db.transaction(RECOMMEND_STORE, 'readonly');
    const data = await tx.store.get('recommendations');
    await tx.done;
    return data || null;
}

export const saveBookstoDB = async (books) => {
    const db = await initDB();
    await db.put(STORE_NAME, books, 'books');
}

export const getBooksFromDB = async () => {
    const db = await initDB();
    return db.get(STORE_NAME, 'books')
}


export const addToQueue = async (action) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.add(action)
    await tx.done
}
export const getQueue = async () => {
    const db = await initDB()
    const tx = db.getAll(QUEUE_STORE)
    await tx.done
}


export const removeFromQueue = async (key) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.delete(key)
    await tx.done
}
export const clearQueue = async (action) => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readwrite')
    await tx.store.clear()
    await tx.done
}
const deduplicate = (queue) => {
    const seen = new Map()
    const result = []
    for (let action of queue) {
        const key = `${action.type}-${action?.data?.googleId || ''}`
        seen.set(key, action)
    }
    return Array.from(seen.values())
}
export const syncQueue = async () => {
    const db = await initDB()
    const tx = db.transaction(QUEUE_STORE, 'readonly')
    const keys = await tx.store.getAllKeys()
    const actions = await tx.store.getAll()
    const deduplicatedActions = deduplicate(actions)
    for (let i = 0; i < deduplicatedActions.length; i++) {
        const action = deduplicatedActions[i]
        try {
            if (action.type === "ADD_TO_SHELF") {
                await fetch("http://localhost:3000/bookshelf/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(action.data)
                })
                toast.success(`Book added to ${action.data.bookshelfId}`)
            }
            else if (action.type === "SAVE_REFLECTION") {
                const res = await fetch('http://localhost:3000/reflection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(action.data)
                })
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REFLECTION_SAVED', {
                        detail: {
                            reflection: action.data.content,
                            googleId: action.data.googleId
                        }
                    }));
                    toast.success("Reflection saved successfully")

                }
            }
            else if (action.type === "ADD_REVIEW") {
                const res = await fetch('http://localhost:3000/review', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(action.data)
                }
                )
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REVIEW_SAVED', {
                        detail: {
                            review: action.data.content,
                            rating: Number(action.data.rating),
                            googleId: action.data.googleId
                        }
                    }));
                    toast.success("Review submitted successfully")

                }
            } else if (action.type === "EDIT_REVIEW") {
                const res = await fetch(`http://localhost:3000/review/${action.data.googleId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        content: action.data.content,
                        rating: action.data.rating
                    })
                })
                if (res.ok) {
                    window.dispatchEvent(new CustomEvent('REVIEW_SAVED', {
                        detail: {
                            review: action.data.content,
                            rating: Number(action.data.rating),
                            googleId: action.data.googleId
                        }
                    }));
                    toast.success("Review submitted successfully")

                }
            } else if (action.type === "SAVE_GOAL") {
                const res = await fetch(`http://localhost:3000/goal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        year: action.data.year,
                        target: action.data.target,
                        isPublic: action.data.isPublic

                    })
                })
                if (res.ok) {

                    window.dispatchEvent(new CustomEvent('GOAL_SAVED', {
                        detail: {
                            year: action.data.year,
                            target: Number(action.data.target),
                            isPublic: action.data.isPublic,
                            userId: action.data.userId
                        }
                    }));
                    toast.success("Goal set!")


                }
            }
            await removeFromQueue(keys[i])
        } catch (err) {
            console.error('Failed to sync', err)
        }
    }
}
export { STORE_NAME, QUEUE_STORE }

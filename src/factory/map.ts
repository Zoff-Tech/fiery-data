
import * as firebase from 'firebase'



import { FierySystem, FieryEntry, FieryTarget, FieryData, FieryOptions, FieryMap, FieryCacheEntry } from '../types'
import { forEach } from '../util'
import { refreshData } from '../data'
import { getCacheForDocument, removeDataFromEntry, removeCacheFromEntry, destroyCache } from '../cache'
import { stats } from '../stats'
import { updatePointers, getChanges } from '../entry'
import { callbacks } from '../callbacks'



export type OnSnapshot = (querySnapshot: firebase.firestore.QuerySnapshot) => any
export type OnResolve = (target: FieryTarget) => any
export type OnReject = (reason: any) => any



function factory (entry: FieryEntry): FieryMap
{
  type CollectionQuery = firebase.firestore.CollectionReference | firebase.firestore.Query
  const options: FieryOptions = entry.options
  const query: CollectionQuery = (options.query
    ? options.query(entry.source as firebase.firestore.CollectionReference)
    : entry.source) as CollectionQuery

  entry.requery = (query) =>
  {
    const initial = getInitialHandler(entry)

    if (!entry.target)
    {
      entry.target = options.newCollection()
    }

    stats.queries++

    if (options.once)
    {
      entry.promise = query.get(options.onceOptions)
        .then(initial)
        .catch(options.onError)
    }
    else
    {
      let resolve: OnResolve = () => {}
      let reject: OnReject = () => {}

      entry.promise = new Promise<FieryTarget>((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })

      entry.off = query.onSnapshot(
        options.liveOptions,
        getLiveHandler(entry, initial, resolve),
        (reason: any) => {
          reject(reason)
          options.onError(reason)
        }
      )
    }

    options.onPromise(entry.promise)
  }

  entry.requery(entry.query = query)

  return entry.target as FieryMap
}

export function getInitialHandler (entry: FieryEntry): OnSnapshot
{
  const options: FieryOptions = entry.options
  const system: FierySystem = entry.instance.system

  return (querySnapshot: firebase.firestore.QuerySnapshot) =>
  {
    const target: FieryMap = entry.target as FieryMap
    const missing: FieryMap = { ...target }

    options.onMutate(() =>
    {
      querySnapshot.forEach((doc: firebase.firestore.DocumentSnapshot) =>
      {
        const cache: FieryCacheEntry = getCacheForDocument(entry, doc, true)

        refreshData(cache, doc, entry)

        system.setProperty(target, doc.id, cache.data)

        delete missing[doc.id]

        callbacks.onCollectionAdd(cache.data, target, entry)

      }, options.onError)

      forEach(missing, (_missed, key) => system.removeProperty(target, key as string))

      return target
    })

    forEach(missing, data =>
    {
      callbacks.onCollectionRemove(data, target, entry)

      removeDataFromEntry(entry, data)
    })

    options.onSuccess(target)

    updatePointers(entry, querySnapshot)

    callbacks.onCollectionChanged(target, entry)

    return target
  }
}

export function getUpdateHandler (entry: FieryEntry): OnSnapshot
{
  const options: FieryOptions = entry.options
  const system: FierySystem = entry.instance.system

  return (querySnapshot: firebase.firestore.QuerySnapshot) =>
  {
    const target: FieryMap = entry.target as FieryMap

    options.onMutate(() =>
    {
      const changes = getChanges(querySnapshot)

      changes.forEach((change: firebase.firestore.DocumentChange) =>
      {
        const doc: firebase.firestore.DocumentSnapshot = change.doc
        const cache: FieryCacheEntry = getCacheForDocument(entry, doc)

        switch (change.type)
        {
          case 'modified':
            const updated: FieryData = refreshData(cache, doc, entry)
            system.setProperty(target, doc.id, updated)

            callbacks.onCollectionModify(updated, target, entry)
            break

          case 'added':
            const created: FieryData = refreshData(cache, doc, entry)
            system.setProperty(target, doc.id, created)

            callbacks.onCollectionAdd(created, target, entry)
            break

          case 'removed':
            callbacks.onCollectionRemove(cache.data, target, entry)

            system.removeProperty(target, doc.id)

            if (doc.exists)
            {
              removeCacheFromEntry(entry, cache)
            }
            else
            {
              if (options.propExists)
              {
                system.setProperty(cache.data, options.propExists, false)
              }

              cache.exists = false

              options.triggerEvent(cache.data, 'remove')

              destroyCache(cache)
            }
            break
        }
      }, options.onError)

      return target
    })

    options.onSuccess(target)

    updatePointers(entry, querySnapshot)

    callbacks.onCollectionChanged(target, entry)
  }
}

export function getLiveHandler (entry: FieryEntry, handleInitial: OnSnapshot, resolve: OnResolve): OnSnapshot
{
  const handleUpdate: OnSnapshot = getUpdateHandler(entry)
  let handler: OnSnapshot = handleInitial

  return (querySnapshot: firebase.firestore.QuerySnapshot) =>
  {
    handler(querySnapshot)
    resolve(entry.target as FieryTarget)
    handler = handleUpdate
  }
}

export default factory

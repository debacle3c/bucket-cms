"use client"
import React, { useState } from "react"
import CollectionsList from "./CollectionsList"
import CollectionManage from "./CollectionManage"
import CollectionForm from "./CollectionForm"
import ItemForm from "./ItemForm"
import { CollectionData } from "../../types"
import { useFetchCollectionsCount } from "../../hooks"
import CollectionEdit from "./CollectionEdit"

function AdminHome() {
  const [manageCollection, setManageCollection] = useState<CollectionData | undefined>(undefined)
  const [createItemInCollection, setCreateItemInCollection] = useState<CollectionData | undefined>(undefined)
  const [editCollection, setEditCollection] = useState<CollectionData | undefined>(undefined)
  const [collections, isLoading, error] = useFetchCollectionsCount(true)

  return (
    <>
      {!isLoading && (
        <div className="py-12">
          {manageCollection ? (
            <CollectionManage
              collections={collections}
              onCreateItem={(collectionData) => {
                setManageCollection(undefined)
                setCreateItemInCollection(collectionData)
              }}
              onManage={setManageCollection}
              onFinish={() => setManageCollection(undefined)}
              collectionData={manageCollection}
            />
          ) : (
            <>
              {createItemInCollection ? (
                <ItemForm collectionName={createItemInCollection.collectionName} onCancel={() => setCreateItemInCollection(undefined)} onComplete={() => setCreateItemInCollection(undefined)} />
              ) : (
                collections && (
                  <>
                    {editCollection ? (
                      <CollectionEdit collectionData={editCollection} onCancel={() => setEditCollection(undefined)} onComplete={() => setEditCollection(undefined)} />
                    ) : (
                      <CollectionsList collections={collections} onCreateItem={setCreateItemInCollection} onManage={setManageCollection} onEdit={setEditCollection} />
                    )}
                  </>
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AdminHome

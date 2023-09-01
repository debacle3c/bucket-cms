import React, { useState, useEffect } from "react"
import ItemForm from "./ItemForm"
import { Button } from "../../ui"
import { CollectionItemData } from "../../types"
import { Transition } from "@headlessui/react"

function CollectionManage({ collectionName, onFinish, onCreateItem }: { collectionName: string; onFinish: () => void; onCreateItem: (collectionName: string) => void }) {
  const [items, setItems] = useState<Array<CollectionItemData>>([])
  const [editItem, setEditItem] = useState<CollectionItemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [collectionName])

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/bucket/items/read?collectionName=${collectionName}`)
      if (!response.ok) {
        throw new Error("Failed to fetch items")
      }
      const data = await response.json()
      setItems(data.items)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditItem(null)
  }

  const handleCompleteEdit = () => {
    setEditItem(null)
    fetchItems() // Refresh the items list after editing
  }

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/bucket/item/delete?itemId=${itemId}&collectionName=${collectionName}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete item")
        }

        // Refresh items list after successful deletion
        fetchItems()
      } catch (error: any) {
        console.error(error)
        alert("An error occurred while trying to delete the item. Please try again.")
      }
    }
  }

  return (
    <>
      <div className="flex justify-center pt-12">
        <Button className="-mt-16 bg-[rgba(255,255,255,.75)] hover:bg-white" variant="outline" onClick={onFinish}>
          <span className="text-2xl -mt-[2px] pr-2 opacity-50 font-thin scale-x-125">‹</span> Back to Admin
        </Button>
      </div>

      {!editItem && !loading && (
        <div className="flex items-center justify-center w-full">
          <Transition
            appear={true}
            show={true}
            enter="transition-all duration-300"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            className="my-8 bg-white p-8 rounded-xl shadow"
          >
            <div>
              <h3 className="text-center uppercase tracking-wide opacity-50 text-sm -mt-2">Manage</h3>
              <h4 className="text-center font-semibold text-4xl pb-6">{collectionName}</h4>
              <div className="border-t min-w-[480px]">
                {items.map((item) => (
                  <div key={item.itemId} className="flex justify-between items-center border-b py-4 px-8">
                    <div className="pr-12">{item.itemName}</div>
                    <div>
                      <Button variant="outline" className="text-blue-600" onClick={() => setEditItem(item)}>
                        edit
                      </Button>
                      <Button aria-label={`Delete ${item.itemName}`} variant="ghost" className="text-xl ml-2 p-2 -mr-8 text-red-500 hover:text-red-700" onClick={() => handleDeleteItem(item.itemId)}>
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="w-full text-right my-4">
                  <Button onClick={() => onCreateItem(collectionName)} variant="outline" className="text-green-600">
                    + New
                  </Button>
                </div>
                {items.length === 0 && <div className="p-8 w-full text-center text-lg italic opacity-60 border-b mb-4">This collection is empty...</div>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && <ul></ul>}
              </div>
            </div>
          </Transition>
        </div>
      )}

      {editItem && (
        <div className="py-4">
          <ItemForm collectionName={collectionName} itemToEdit={editItem} onCancel={handleCancelEdit} onComplete={handleCompleteEdit} />
        </div>
      )}
    </>
  )
}

export default CollectionManage

import React, { useState, useEffect } from "react"
import ItemForm from "./ItemForm"
import { Button } from "@/app/components/ui/button"
import { CollectionItemData } from "../types"

function CollectionManage({ collectionName, onFinish }: { collectionName: string; onFinish: () => void }) {
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

  return (
    <>
      <div className="flex justify-center">
        <Button className="-mt-16 bg-[rgba(255,255,255,.75)] hover:bg-white" variant="outline" onClick={onFinish}>
          <span className="text-2xl -mt-[2px] pr-2 opacity-50 font-thin scale-x-125">‹</span> Back to Admin
        </Button>
      </div>

      {!editItem && !loading && (
        <div className="my-8 bg-white p-8 rounded-xl shadow">
          <h3 className="text-center uppercase tracking-wide opacity-50 text-sm -mt-2">Manage</h3>
          <h4 className="text-center font-semibold text-4xl pb-6">{collectionName}</h4>
          <div className="border-t">
            {items.map((item) => (
              <div key={item.itemId} className="flex justify-between items-center border-b py-4 px-8">
                {item.itemName}
                <Button onClick={() => setEditItem(item)}>edit</Button>
              </div>
            ))}
            {items.length === 0 && <div className="p-8 w-full text-center text-lg italic opacity-60 border-b mb-4">This collection is empty...</div>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && <ul></ul>}
          </div>
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

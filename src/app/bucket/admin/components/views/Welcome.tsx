"use client"
import React, { useState, useEffect } from "react"
import CollectionsIntro from "./CollectionsIntro"
import EnvironmentStatus from "./EnvironmentStatus"
import { ConfigValidation, CollectionData } from "../types"
import CollectionsAdmin from "./CollectionsAdmin"
import { Button } from "../ui"

function Welcome({ onCreateCollection }: { onCreateCollection: () => void }) {
  const [configValidation, setConfigValidation] = useState<undefined | ConfigValidation>(undefined)
  const [collections, setCollections] = useState<undefined | CollectionData[]>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"ADMIN" | "DEV">("ADMIN")
  const isConfigured = configValidation?.hasAWSSecret && configValidation?.hasAWSRegion && configValidation?.hasAWSBucket

  useEffect(() => {
    getConfigValidation()
  }, [])

  useEffect(() => {
    if (isConfigured) {
      getCollections()
    }
  }, [isConfigured])

  const getConfigValidation = async () => {
    const configValidationResponse = await fetch("/api/bucket/config/read")
    const configValidationResponseData = await configValidationResponse.json()
    setConfigValidation(configValidationResponseData)
  }

  const getCollections = async () => {
    setIsLoading(true)
    const response = await fetch("/api/bucket/collections/read")
    const responseData = await response.json()
    setCollections(responseData.collections)
    setIsLoading(false)
  }

  return (
    <>
      {configValidation && (
        <>
          {isConfigured ? (
            collections ? (
              collections.length ? (
                isLoading ? null : (
                  <>
                    {view === "ADMIN" && (
                      <>
                        <Button onClick={() => setView("DEV")} variant="outline" className="absolute top-0 right-8 flex items-center bg-white hover:bg-white opacity-80 hover:opacity-100">
                          Go to Dev View
                          <span className="opacity-60 text-3xl font-thin relative ml-px left-1 -top-[2px]">»</span>
                        </Button>
                        <CollectionsAdmin collections={collections} onCreateCollection={getCollections} />
                      </>
                    )}
                    {view === "DEV" && (
                      <>
                        <Button onClick={() => setView("ADMIN")} variant="outline" className="absolute top-0 right-8 flex items-center bg-white hover:bg-white opacity-80 hover:opacity-100">
                          <span className="opacity-60 text-3xl font-thin relative ml-px right-1 -top-[2px]">«</span>
                          Go to Admin View
                        </Button>
                        <div>Dev View</div>
                      </>
                    )}
                  </>
                )
              ) : (
                <CollectionsIntro onCreateCollection={onCreateCollection} />
              )
            ) : null
          ) : (
            <EnvironmentStatus configValidation={configValidation} />
          )}
        </>
      )}
    </>
  )
}

export default Welcome

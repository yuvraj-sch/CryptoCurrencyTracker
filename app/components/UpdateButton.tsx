"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateData } from "../actions/crypto"

export function UpdateButton() {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateData()
      window.location.reload() // Force a full page reload to get the latest data
    } catch (error) {
      console.error("Failed to update data:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex justify-center mt-8">
      <Button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Data"}
      </Button>
    </div>
  )
}


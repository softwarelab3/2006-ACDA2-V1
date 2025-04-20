"use client"

import { Map, List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
  onToggle: (view: "list" | "map" | "both") => void
  currentView: "list" | "map" | "both"
}

export default function ViewToggle({ onToggle, currentView }: ViewToggleProps) {
  return (
    <div className="bg-white rounded-full shadow-md p-1 inline-flex">
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-3 ${currentView === "list" ? "bg-primary text-white" : ""}`}
        onClick={() => onToggle("list")}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button
        variant={currentView === "map" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-3 ${currentView === "map" ? "bg-primary text-white" : ""}`}
        onClick={() => onToggle("map")}
      >
        <Map className="h-4 w-4 mr-2" />
        Map
      </Button>
      <Button
        variant={currentView === "both" ? "default" : "ghost"}
        size="sm"
        className={`rounded-full px-3 ${currentView === "both" ? "bg-primary text-white" : ""}`}
        onClick={() => onToggle("both")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Both
      </Button>
    </div>
  )
}


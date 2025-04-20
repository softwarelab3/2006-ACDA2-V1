"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Grid2X2 } from "lucide-react"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

interface PhotoGridProps {
  photos: string[]
  stallName: string
}

export default function PhotoGrid({ photos, stallName }: PhotoGridProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[60vh] max-h-[500px] overflow-hidden">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={photos[0] || "/placeholder.svg"}
              alt={`${stallName} main photo`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {photos.slice(1, 5).map((photo, index) => (
            <div key={index} className="relative">
              <Image
                src={photo || "/placeholder.svg"}
                alt={`${stallName} photo ${index + 2}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
          <Button
            variant="secondary"
            className="absolute bottom-4 right-4 flex items-center gap-1"
            onClick={() => setShowAllPhotos(true)}
          >
            <Grid2X2 size={16} />
            <span>Show all photos</span>
          </Button>
        </div>
      </div>

      <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
        <DialogContent className="max-w-6xl w-full p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-xl font-bold">{stallName} Photos</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 overflow-y-auto">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`${stallName} photo ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
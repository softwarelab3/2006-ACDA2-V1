"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Stall } from "@/app/types/stall";

interface MapViewProps {
  stalls: Array<Stall>
}

export default function MapView({ stalls }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const mapInitializedRef = useRef(false)

  // Initialize map when component mounts
  useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === "undefined") return

    // Check if Mapbox token exists
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    if (!token) {
      setError("Mapbox access token is missing")
      setLoading(false)
      return
    }

    // Set the token
    mapboxgl.accessToken = token

    // Only initialize map once
    if (!mapRef.current || mapInitializedRef.current) return

    try {
      const newMap = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [103.8198, 1.3521], // Default to Singapore coordinates
        zoom: 11,
      })

      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Wait for map to load before setting state
      newMap.on("load", () => {
        setMap(newMap)
        setLoading(false)
        mapInitializedRef.current = true
      })

      // Handle map load error
      newMap.on("error", (event: { error: Error }) => {
        setError(`Map error: ${event.error.message || "Unknown error"}`)
        setLoading(false)
      })

      // Clean up on unmount
      return () => {
        if (newMap) {
          // Remove all markers
          markersRef.current.forEach((marker) => marker.remove())
          markersRef.current = []

          newMap.remove()
          mapInitializedRef.current = false
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to initialize map: ${errorMessage}`)
      setLoading(false)
    }
  }, [])

  // Add markers when locations change or map is initialized
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Calculate bounds to fit all markers
    const bounds = new mapboxgl.LngLatBounds()

    // Add markers for each location
    stalls.forEach((stall) => {
      try {
        // Create custom popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 12px;">
              <h3 style="font-weight: 500; margin-bottom: 4px;">${stall.stallName}</h3>
              <p style="font-size: 14px; margin: 0;">Price: ${stall.priceRange}</p>
            </div>
          `)

        // Add marker
        const marker = new mapboxgl.Marker().setLngLat([stall.hawkerCenter.longitude, stall.hawkerCenter.latitude]).setPopup(popup).addTo(map)

        // Store marker reference for cleanup
        markersRef.current.push(marker)

        // Extend bounds to include this location
        bounds.extend([stall.hawkerCenter.longitude, stall.hawkerCenter.latitude])
      } catch (err) {
        console.error("Error adding marker:", err)
      }
    })

    // Only adjust bounds if we have locations
    if (stalls.length > 0) {
      try {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        })
      } catch (err) {
        console.error("Error fitting bounds:", err)
      }
    }
  }, [map, stalls])

  // Handle resize when map becomes visible
  useEffect(() => {
    if (!map) return

    const handleResize = () => {
      map.resize()
    }

    // Resize map when window resizes
    window.addEventListener("resize", handleResize)

    // Force resize after a short delay to ensure the container is fully visible
    const resizeTimeout = setTimeout(() => {
      handleResize()
    }, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [map])

  if (error) {
    return (
      <div className="h-full w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please check your Mapbox access token and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" style={{ visibility: loading ? "hidden" : "visible" }} />
    </div>
  )
}
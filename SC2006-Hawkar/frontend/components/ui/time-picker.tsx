"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState("12")
  const [minutes, setMinutes] = useState("00")
  const [period, setPeriod] = useState("AM")

  // Parse the value when it changes
  useEffect(() => {
    if (value) {
      try {
        // Convert 24-hour format to 12-hour format for display
        const [hourStr, minuteStr] = value.split(":")
        const hourNum = Number.parseInt(hourStr, 10)

        if (hourNum === 0) {
          setHours("12")
          setPeriod("AM")
        } else if (hourNum === 12) {
          setHours("12")
          setPeriod("PM")
        } else if (hourNum > 12) {
          setHours(String(hourNum - 12).padStart(2, "0"))
          setPeriod("PM")
        } else {
          setHours(String(hourNum).padStart(2, "0"))
          setPeriod("AM")
        }

        setMinutes(minuteStr)
      } catch {
        // If parsing fails, set default values
        setHours("12")
        setMinutes("00")
        setPeriod("AM")
      }
    }
  }, [value])

  // Convert 12-hour format to 24-hour format for the input value
  const handleTimeChange = () => {
    let hourNum = Number.parseInt(hours, 10)

    // Convert to 24-hour format
    if (period === "PM" && hourNum < 12) {
      hourNum += 12
    } else if (period === "AM" && hourNum === 12) {
      hourNum = 0
    }

    const formattedHours = String(hourNum).padStart(2, "0")
    const formattedMinutes = minutes.padStart(2, "0")

    onChange(`${formattedHours}:${formattedMinutes}`)
    setIsOpen(false)
  }

  // Format the display time
  const displayTime = value
    ? (() => {
        const [hourStr, minuteStr] = value.split(":")
        const hourNum = Number.parseInt(hourStr, 10)

        if (hourNum === 0) {
          return `12:${minuteStr} AM`
        } else if (hourNum === 12) {
          return `12:${minuteStr} PM`
        } else if (hourNum > 12) {
          return `${hourNum - 12}:${minuteStr} PM`
        } else {
          return `${hourNum}:${minuteStr} AM`
        }
      })()
    : "Select time"

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between bg-gray-200 border-0 hover:bg-gray-300 py-6 ${className}`}
        >
          <span>{displayTime}</span>
          <Clock className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <div className="grid gap-1">
              <label htmlFor="hours" className="text-xs font-medium">
                Hours
              </label>
              <Input
                id="hours"
                className="w-16"
                value={hours}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d{0,2}$/.test(val)) {
                    const num = val === "" ? 0 : Number.parseInt(val, 10)
                    if (num >= 0 && num <= 12) {
                      setHours(val)
                    }
                  }
                }}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="minutes" className="text-xs font-medium">
                Minutes
              </label>
              <Input
                id="minutes"
                className="w-16"
                value={minutes}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d{0,2}$/.test(val)) {
                    const num = val === "" ? 0 : Number.parseInt(val, 10)
                    if (num >= 0 && num <= 59) {
                      setMinutes(val.padStart(2, "0"))
                    }
                  }
                }}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="period" className="text-xs font-medium">
                Period
              </label>
              <div className="flex rounded-md border">
                <Button
                  type="button"
                  variant={period === "AM" ? "default" : "outline"}
                  className={`rounded-r-none px-3 ${period === "AM" ? "bg-primary" : ""}`}
                  onClick={() => setPeriod("AM")}
                >
                  AM
                </Button>
                <Button
                  type="button"
                  variant={period === "PM" ? "default" : "outline"}
                  className={`rounded-l-none px-3 ${period === "PM" ? "bg-primary" : ""}`}
                  onClick={() => setPeriod("PM")}
                >
                  PM
                </Button>
              </div>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleTimeChange}>
            Set Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
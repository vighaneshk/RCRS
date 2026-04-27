"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, X, Volume2, VolumeX, Loader2 } from "lucide-react"

interface SOSButtonProps {
  size?: "default" | "large"
  silent?: boolean
}

export function SOSButton({ size = "default", silent = false }: SOSButtonProps) {
  const router = useRouter()
  const { triggerSOS, requestLocation, demoMode } = useApp()
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isTriggering, setIsTriggering] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)

  const handleCancel = useCallback(() => {
    setShowCountdown(false)
    setCountdown(5)
    setIsTriggering(false)
    setHoldProgress(0)
    setIsHolding(false)
  }, [])

  const handleTrigger = useCallback(async () => {
    setIsTriggering(true)
    await triggerSOS(silent)
    setShowCountdown(false)
    setCountdown(5)
    setIsTriggering(false)
    router.push("/emergency")
  }, [triggerSOS, silent, router])

  useEffect(() => {
    if (!showCountdown) return

    if (countdown === 0) {
      handleTrigger()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(c => c - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [showCountdown, countdown, handleTrigger])

  // Hold to activate (for large button)
  useEffect(() => {
    if (!isHolding || size !== "large") return

    const interval = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          setIsHolding(false)
          setHoldProgress(0)
          requestLocation().then(() => setShowCountdown(true))
          return 0
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isHolding, size, requestLocation])

  const handleMouseDown = () => {
    if (size === "large") {
      setIsHolding(true)
    }
  }

  const handleMouseUp = () => {
    if (size === "large") {
      setIsHolding(false)
      setHoldProgress(0)
    }
  }

  const handleClick = async () => {
    if (size !== "large") {
      await requestLocation()
      setShowCountdown(true)
    }
  }

  const buttonSize = size === "large" 
    ? "h-44 w-44" 
    : "h-16 w-16"

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className={`
          ${buttonSize}
          relative overflow-hidden rounded-full
          ${silent ? "bg-secondary hover:bg-secondary/80" : "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"}
          ${silent ? "text-secondary-foreground" : "text-white"}
          flex flex-col items-center justify-center gap-1 font-bold
          shadow-xl transition-all duration-200 
          hover:shadow-2xl hover:scale-105 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-red-500/30
          select-none
        `}
      >
        {/* Hold progress ring */}
        {size === "large" && holdProgress > 0 && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 176 176">
            <circle
              cx="88"
              cy="88"
              r="84"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
            />
            <circle
              cx="88"
              cy="88"
              r="84"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={528}
              strokeDashoffset={528 - (528 * holdProgress) / 100}
              className="transition-all duration-100"
            />
          </svg>
        )}

        {/* Pulse effect for large button */}
        {size === "large" && !silent && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" style={{ animationDuration: "2s" }} />
            <span className="absolute inset-2 animate-pulse rounded-full bg-red-500/20" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          {silent ? (
            <>
              <VolumeX className={size === "large" ? "h-10 w-10" : "h-5 w-5"} />
              <span className={size === "large" ? "text-sm" : "text-xs"}>Silent</span>
              <span className={size === "large" ? "text-lg" : "text-sm"}>SOS</span>
            </>
          ) : (
            <>
              <AlertTriangle className={size === "large" ? "h-14 w-14" : "h-6 w-6"} />
              <span className={size === "large" ? "text-2xl" : "text-sm"}>SOS</span>
              {size === "large" && (
                <span className="text-xs opacity-80">Hold to activate</span>
              )}
            </>
          )}
        </div>
      </button>

      <Dialog open={showCountdown} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {silent ? "Silent SOS Alert" : "Emergency SOS Alert"}
            </DialogTitle>
            <DialogDescription>
              {demoMode 
                ? "Demo mode: Simulated alerts will be shown."
                : "This will send alerts to your emergency contacts and nearby services."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-8">
            {/* Animated countdown */}
            <div className="relative flex h-36 w-36 items-center justify-center">
              {/* Background circle */}
              <svg className="absolute h-full w-full -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={415}
                  strokeDashoffset={415 - (415 * countdown) / 5}
                  className="text-red-500 transition-all duration-1000 ease-linear"
                />
              </svg>
              
              {/* Pulse animation */}
              <div className="absolute inset-4 animate-pulse rounded-full bg-red-500/10" />
              
              {/* Number */}
              <span className="relative text-6xl font-bold text-red-600">{countdown}</span>
            </div>

            <div className="space-y-2 text-center">
              <p className="font-medium">
                {isTriggering 
                  ? "Sending emergency alert..."
                  : `Alert will be sent in ${countdown} seconds`
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {silent ? (
                  <span className="flex items-center justify-center gap-1">
                    <VolumeX className="h-4 w-4" />
                    Silent mode - No sound or vibration
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <Volume2 className="h-4 w-4" />
                    Alerts will notify all your contacts
                  </span>
                )}
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={isTriggering}
              className="gap-2 border-2"
            >
              {isTriggering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {isTriggering ? "Sending..." : "Cancel Alert"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

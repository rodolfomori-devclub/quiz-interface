import { useEffect, useMemo, useState } from 'react'

export interface CountdownState {
  hours: number
  minutes: number
  seconds: number
  total: number // milissegundos restantes
  isExpired: boolean
  formatted: string // "HH:MM:SS"
}

const computeRemaining = (target: number): number => Math.max(0, target - Date.now())

const pad = (value: number): string => String(value).padStart(2, '0')

/**
 * Contagem regressiva até `targetMs` (timestamp em ms). Atualiza a cada 1s e
 * limpa o intervalo no unmount / quando o alvo é atingido.
 * Passar `null` desativa a contagem (isExpired = false).
 */
export function useCountdown(targetMs: number | null): CountdownState {
  const [remaining, setRemaining] = useState<number>(() =>
    targetMs ? computeRemaining(targetMs) : 0
  )

  useEffect(() => {
    if (!targetMs) {
      setRemaining(0)
      return
    }

    setRemaining(computeRemaining(targetMs))

    const intervalId = setInterval(() => {
      const next = computeRemaining(targetMs)
      setRemaining(next)
      if (next <= 0) {
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetMs])

  return useMemo(() => {
    const totalSeconds = Math.floor(remaining / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      hours,
      minutes,
      seconds,
      total: remaining,
      isExpired: !!targetMs && remaining <= 0,
      formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    }
  }, [remaining, targetMs])
}

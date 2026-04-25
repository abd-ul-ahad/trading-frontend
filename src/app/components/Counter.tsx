'use client'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { increment, decrement, incrementByAmount, reset } from '@/lib/redux/features/counter/counterSlice'

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col items-center gap-4 p-8 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-bold text-foreground">Redux Counter</h2>
      <div className="text-4xl font-mono text-foreground">{count}</div>
      <div className="flex gap-2">
        <button 
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
        >
          Decrement
        </button>
        <button 
          onClick={() => dispatch(reset())}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Increment
        </button>
      </div>
      <button 
        onClick={() => dispatch(incrementByAmount(5))}
        className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/80 transition-colors border border-border"
      >
        Add 5
      </button>
    </div>
  )
}

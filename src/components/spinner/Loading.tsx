import RippleSpinner from './RippleSpinner'

interface LoadingProps {
  texto?: string
}

export default function Loading({ texto }: LoadingProps) {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/5 backdrop-blur-sm'>
      <RippleSpinner size="lg" />
        {texto && (
          <span className="text-center text-sm font-medium text-foreground/80">
            {texto}
          </span>
        )}
    </div>
  )
}
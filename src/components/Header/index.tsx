import { Wordmark } from '../Wordmark'
import { BrandControls } from '../BrandControls'

export const Header = () => {
  return (
    <header className="w-full border-t-2 border-brand">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Wordmark />
        <BrandControls />
      </div>
      <div className="border-b border-line" />
    </header>
  )
}

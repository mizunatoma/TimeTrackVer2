import { ReactNode } from 'react'

type Props = {
  htmlFor: string // <label>
  children: ReactNode // <FormLabel>
}

export const FormLabel = ({ htmlFor, children }: Props) => (
  <label
    htmlFor={htmlFor}
    className="mb-2 block text-sm font-medium text-gray-600"
  >
    {children}
  </label>
)

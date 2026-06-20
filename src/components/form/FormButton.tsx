import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '../ui/loading-spinner'

type Props = {
  loading: boolean
  label: string
  type?: 'submit' | 'button'
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export const FormButton = ({
  loading,
  label,
  type = 'submit',
  variant = 'primary',
  onClick,
}: Props) => (
  <Button
    type={type}
    disabled={loading}
    variant={variant === 'primary' ? 'default' : 'outline'}
    className="h-11 w-full rounded-lg"
    onClick={onClick}
  >
    {loading ? (
      <>
        <LoadingSpinner className="h-4 w-4" />
        送信中...
      </>
    ) : (
      label
    )}
  </Button>
)

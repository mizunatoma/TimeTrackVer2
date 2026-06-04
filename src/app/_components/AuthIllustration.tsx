import Image from 'next/image'

export default function AuthIllustration() {
  return (
    <div className="hidden h-full items-center justify-center bg-white p-12 lg:flex">
      <Image
        src="/images/auth-illustration.png"
        alt="時計とPCのイラスト"
        className="w-full max-w-md rounded-2xl"
        width={506}
        height={506}
      />
    </div>
  )
}

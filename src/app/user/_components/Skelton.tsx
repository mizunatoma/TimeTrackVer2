'use client'

export default function Skelton({
  height,
  children,
}: {
  height?: string
  children?: React.ReactNode // React.ReactNode「JSXとして渡せるものすべて」
}) {
  return (
    <div
      className={`${height ?? ''} flex w-full animate-shimmer flex-col gap-4 rounded-2xl bg-[linear-gradient(90deg,#ede9de_0%,#ede9de_25%,#f7f5ef_50%,#ede9de_75%,#ede9de_100%)] bg-[length:200%_100%] p-6 shadow-sm`}
    >
      {children}
    </div>
  )
}

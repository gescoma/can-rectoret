'use client'

import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Header } from '@/payload-types'
import { HeaderNav } from './Nav'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import { useSticky } from './hooks/use-is-sticky'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [headerBarRef, sticky] = useSticky()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header ref={headerBarRef} className={`container sticky top-4 z-20 rounded-3xl transition-all ${sticky && "bg-white shadow"}`} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-4 px-4 grid lg:grid-cols-[300px_1fr_300px] justify-center items-center gap-4">
        <Link href="/">
          <Logo className="text-black dark:text-black w-36" />
        </Link>
        <HeaderNav data={data} />
        <Button asChild variant='ghost' color='primary' >
          <Link href="tel:1234567890">
            <span className="text-sm">Call Us</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}

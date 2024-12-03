'use client'

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

function Header() {
  const router = useRouter()


  return (
    <header className='w-screeh-[60px] xl:flex-all-center border-b border-b-slate02'>
     {/* Small image for mobile */}
    <div className='xl:w-[1200px] h-full px-4 py-2.5'>
      <Image
          src="/svgs/img-header-small.svg"
          alt="header-logo"
          width={71}
          height={40}
          priority
          onClick={() => router.push('/')}
          className="block md:hidden"
          />
        {/* Large image for tablet and desktop */}
        <Image
          src="/svgs/img-header-large.svg"
          alt="header-logo"
          width={151}
          height={40}
          priority
          onClick={() => router.push('/')}
          className="hidden md:block"
          />
      </div>
    </header>
  )
}

export default Header
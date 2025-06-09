import { CMSLink } from '@/components/Link'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import React from 'react'
import RichText from '@/components/RichText'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
<section className="bg-white">
  <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
      <img className="w-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg" alt="dashboard image" />
      <div className="mt-4 md:mt-0">
        {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        <div className="">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} />
          })}
        </div>
      </div>
  </div>
</section>
  )
}

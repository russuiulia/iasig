/* eslint-disable @next/next/no-img-element */

import { Carousel } from 'react-responsive-carousel'
import { TranslatedLink } from '~/components/translatedLink/translatedLink'
import { useTranslation } from '~/context/LanguageContext'
import { IsgImage } from '../isgImage/isgImage'
import styles from './blog.module.scss'

const BlogItem = ({ blog, index }): JSX.Element => {
  const { locale, translate } = useTranslation()
  return (
    <article
      className={`flex flex-col ${
        index === 0 ? `md:col-span-2 ${styles.firstCol}` : `md:col-span-1 md:h-96 ${styles.col}`
      } overflow-hidden  rounded-2xl relative h-full`}
    >
      <div className="h-full">
        <IsgImage
          className="filter rounded-lg brightness-75 object-cover h-full w-full"
          src={blog.imageUrl}
          height={index === 0 ? 900 : 1200}
          width={1080}
          showSmall={false}
        />
      </div>
      <div
        className={`${
          index === 0 ? 'md:w-9/12' : ''
        } text-left px-10 absolute top-0 bottom-0 flex flex-col justify-center mx-auto`}
      >
        <TranslatedLink locale={locale} pageKey={blog.pageKey}>
          <a rel="noreferrer" target="_blank">
            <p className="mb-6 text-white text-3xl font-bold">{translate(blog.title)}</p>
          </a>
        </TranslatedLink>
        <p className={`text-white text-lg mb-6 text-justify	`}>
          {blog.description || translate(`${blog.title}-summary`)}
        </p>
        <TranslatedLink locale={locale} pageKey={blog.pageKey}>
          <a
            rel="noreferrer"
            target="_blank"
            className={`btn flex inter-500 justify-start items-center h-6 py-4 text-white bg-transparent focus:shadow-outline `}
          >
            {translate('more')}
            <span className="ml-2 w-5 h-5">
              <img src="/images/white-arrow-right.svg" alt="white-arrow" width={20} height={20} />
            </span>
          </a>
        </TranslatedLink>
      </div>
    </article>
  )
}

export interface BlogProps {
  currentBlogs: any[]
}

export const Blog = ({ currentBlogs }: BlogProps): JSX.Element => {
  const { translate, locale } = useTranslation()
  return (
    <section className={`${styles.blogContainer} container`}>
      <h2 className="text-center lg:mb-6 mb-4 pt-24">{translate('blog-title')}</h2>
      <article className="mx-auto gap-5 md:grid-cols-2 hidden md:grid">
        {currentBlogs.map((blog, index) => (
          <BlogItem key={index} blog={blog} index={index} />
        ))}
      </article>
      <article className="md:hidden">
        <Carousel
          centerMode={true}
          showIndicators={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={false}
          centerSlidePercentage={100}
        >
          {currentBlogs.map((blog, index) => (
            <BlogItem key={index} blog={blog} index={index} />
          ))}
        </Carousel>
      </article>
      <div className="text-pink flex justify-center items-center inter-500 pt-10 md:pb-24 pb-6">
        <TranslatedLink locale={locale} pageKey="/blog">
          <a target="_blank" rel="noreferrer" className="mr-2">
            {translate('see-other')}
          </a>
        </TranslatedLink>
        <img src="/images/pink-arrow-right.svg" alt="pink-arrow" width={20} height={20} />
      </div>
    </section>
  )
}

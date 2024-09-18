import { useTranslation } from '~/context/LanguageContext'
import { IsgImage } from '../shared/isgImage/isgImage'
import { TranslatedLink } from '../translatedLink/translatedLink'

export const RecommendedBlogs = ({ blogs, currentPageKey }) => {
  const { locale, translate } = useTranslation()
  return blogs
    .filter((el) => el.pageKey !== currentPageKey)
    .map((blog) => (
      <TranslatedLink key={blog.pageKey} locale={locale} pageKey={blog.pageKey}>
        <a className="md:flex-1">
          <div className="h-40 mx-auto">
            <IsgImage
              src={blog.imageUrl}
              height={112}
              width={112}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg">{translate(blog.title)}</h1>
            <p>{translate(`${blog.title}-summary`).substring(0, 75)}...</p>
          </div>
        </a>
      </TranslatedLink>
    ))
}

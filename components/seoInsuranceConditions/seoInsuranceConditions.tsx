import { NextSeo } from 'next-seo'

export const SeoInsuranceConditions = (): JSX.Element => {
  return (
    <NextSeo
      title="Conditii de asigurare benevola de sanatate"
      description="Obiectul asigurării îl constituie interesele patrimoniale ale Asiguratului, corelate cu
      viaţa şi sănătatea acestuia, precum şi de cheltuieli neprevăzute pentru tratament
      medical, suportate de Asigurat, în urma unei maladii subite şi/sau unui accident
      survenit în perioada aflării temporare peste hotare, ce ţin de cazul asigurat."
      additionalMetaTags={[
        {
          name: 'keywords',
          content:
            'iAsig Asigurari, asigurari, asigurari online, pret asigurare, asigurare masina moldova, rca, casco, asigurari de viata, asigurarea apartamentului, asigurarea medicala',
        },
      ]}
    />
  )
}

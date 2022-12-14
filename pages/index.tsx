import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Navigation from '../components/navigation/navigation'
import PromoSection from '../components/promo-sections/promo-section1'
import Footer from '../components/navigation/footer'
import Products from '../components/products/products'
import { graphqlstorefront } from '../utils/api'


export default function Home(
  { products }: { products: any[] }
) {


  console.log('products', products)


  return (
    <div className={styles.container}>
      <Navigation
      />

      <PromoSection />
      <Products />

      <Footer />

    </div>
  )
}

export const getStaticProps = async () => {
  const data = await graphqlstorefront(producdsQuery)

  console.log('getStaticPropsdata', data)

  return {
    props: {
      products: []
    }
  }
}

const gql = String.raw
const producdsQuery = gql`
query Products {
  products(first:6) {
    edges {
      node {
        title
        handle 
        tags
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first:1) {
          edges {
            node {
              transformedSrc
            }
          }
        }
      }
    }
  }
}
`






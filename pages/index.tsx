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
      <Products products={products} />

      <Footer />

    </div>
  )
}

export const getStaticProps = async () => {
  const data = await graphqlstorefront(producdsQuery)



  const products = data.products.edges.map((edge: any) => {

    const { node } = edge

    console.log("id", node)
    return {
      // id: node.id,
      title: node.title,
      handle: node.handle,
      tags: node.tags,
      price: node.priceRange.minVariantPrice.amount,
      imgSrc: node.images.edges[0].node.transformedSrc,
      imgAlt: node.title,
      color: node.tags[0] || 'black'
    }

  })




  return {
    props: {
      products: products
    }
  }
}

const gql = String.raw
const producdsQuery = gql`
query Products {
  products(first:6) {
    edges {
      node {
        id
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






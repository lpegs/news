import { GetStaticProps } from "next"
import { SessionProvider } from "next-auth/react"
import Head from "next/Head"
import { SubscribeButton } from "../components/SubscribeButton"
import { stripe } from "../services/stripe"
import styles from "./home.module.scss"

// Client-side
// Server-side
// Static Site Generation

interface HomeProps {
  product:{
    priceId: string;
    ammount: number;
  }
}

export default function Home({ product }: HomeProps) {

  return (
    <>
      <Head>
        <title>home | news</title>
      </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👋 Hey, welcome</span>
        <h1>News about the <span>React</span> world.</h1>
        <p>Get access to all publications <br/>
          <span>for {product.ammount} per month</span>
        </p>

      <SessionProvider>
        <SubscribeButton priceId={product.priceId}/>
      </SessionProvider>

      </section>

      <img src="/images/woman.svg" alt="Girl Coding" /> 

    </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  var price = await stripe.prices.retrieve("price_1KoY6yJjPpl0p5wU0sHllyiF")

  var product = {
    priceId: price.id,
    ammount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  }

  return {

    props: {
      product,
    },

    revalidate: 60 * 60 * 24, //24hr

  }

}
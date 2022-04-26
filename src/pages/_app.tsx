import { PrismicPreview } from "@prismicio/next";
import { PrismicProvider } from "@prismicio/react";
import { AppProps } from "next/app";
import Link from "next/link";
import { Header } from "../components/Header";
import "../styles/global.scss";
import { linkResolver, repositoryName } from '../../prismicio'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider
      linkResolver={linkResolver}
      internalLinkComponent={({ href, children, ...props }) => (
        <Link href={href}>
          <a {...props}>
            {children}
          </a>
        </Link>
      )}
    >
        <Header />
        <Component {...pageProps} />
        <PrismicPreview repositoryName={repositoryName}>
      </PrismicPreview>
    </PrismicProvider>
  )

}

export default MyApp

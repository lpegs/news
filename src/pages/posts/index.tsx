import { GetStaticProps } from "next"
import Head from "next/head"
import styles from "./styles.module.scss"
import { getPrismicClient } from "../../../prismicio"
import Link from "next/link"

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }){
    return (
        <>
            <Head>
                <title>posts | news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <Link href={`/posts/${post.slug}`}>
                            <a key={post.slug}>
                                <time>{ post.updatedAt }</time>
                                <strong>{ post.title }</strong>
                                <p>{ post.excerpt }</p>
                            </a>
                        </Link>
                    )) } 
                </div>
            </main>
        </>
    )
}

export async function getStaticProps({ params, previewData }) {
    const client = getPrismicClient({ previewData })
  
    const document = await client.getAllByType('post')

    const posts = document.map(post => {
            return {
                slug: post.uid,
                title: post.data.slices[0].primary.title[0].text,
                excerpt: post.data.slices[0].items[0].Content.find(content => content.type === "paragraph")?.text ?? "",
                updatedAt: new Date(post.last_publication_date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })
            };
            }
            )

    return {
      props: { posts },
    }
  }
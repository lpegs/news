import { GetStaticProps } from "next"
import { useSession } from "next-auth/react";
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../../../prismicio"
import Head from "next/head"
import styles from "../post.module.scss"
import Link from "next/link";
import { useEffect } from "react";
import router from "next/router";

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content01: string;
        content02: string;
        updatedAt: string; 
    }
}

export default function PostPreview({ post }: PostPreviewProps ){

    const {data: session} = useSession()

    console.log(session)

    useEffect(() => {
        if((session)?.activeSubscription){
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return (
        
        <>
            <Head>
                <title>{post.title} | news</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{__html: post.content01}} />

                    <div className={styles.continueReading}>
                        Want to continue reading? 
                        <Link href="/">
                            <a href="">Subscribe now!</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
};

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug } = params

    const client = getPrismicClient()

    const response = await client.getByUID("post", String(slug), {})

    const post = {
        slug,
        title: response.data.slices[0].primary.title[0].text,
        content01: RichText.asHtml(response.data.slices[0].items[0].Content),
        content02: RichText.asHtml(response.data.slices[0].items[1].Content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }

    return {
        props: { post },
        redirect: 60 * 30,
    }

}
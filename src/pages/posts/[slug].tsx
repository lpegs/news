import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react";
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../../prismicio"
import Head from "next/head"
import styles from "./post.module.scss"

interface PostProps {
    post: {
        slug: string;
        title: string;
        content01: string;
        content02: string;
        updatedAt: string; 
    }
}

export default function Post({ post }: PostProps ){
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
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{__html: post.content01}} />
                    <div 
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{__html: post.content02}} />
                </article>
            </main>
        </>
    )
};

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = getSession({ req });
    const { slug } = params

    const client = getPrismicClient(req)

    const response = await client.getByUID("post", String(slug), {})

    // console.log((await session).activeSubscription)

    try {if(!(await session).activeSubscription){
        return {
            redirect: { 
                destination: "/",
                permanent: false,
            }
        }
    }
    } catch {
        return {
            redirect: { 
                destination: "/",
                permanent: false,
            }
        }
    }


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
        props: { post }
    }

}
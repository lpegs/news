import styles from './styles.module.scss'
import { FaGithub } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { signIn, signOut, useSession } from "next-auth/react"
 
export function SignInButton(){

    const {data: session, status} = useSession()

    if (status === "authenticated"){
    return (

        <button 
            className={styles.signInButton} 
            type="button"
            onClick={() => signOut()}
        >
            <img src={session.user.image} />
            {session.user.name}
            <FiX color="#737380" className={styles.closeIcon} />
        </button>

    )}
    else return(

        <button 
            className={styles.signInButton} 
            type="button"
            onClick={() => signIn("github")}
        >
            <FaGithub color="#eba417" />
            Sign in with Github
        </button>

    )

}
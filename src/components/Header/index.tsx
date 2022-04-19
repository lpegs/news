import { SessionProvider } from "next-auth/react";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/news.svg" alt="news" />
                <nav>
                    <a className={styles.active}>Home</a>
                    <a>Posts</a>
                </nav>
                <SessionProvider>
                    <SignInButton />
                </SessionProvider>
                
            </div>
        </header>
    );
}
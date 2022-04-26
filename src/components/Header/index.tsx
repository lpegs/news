import { SessionProvider } from "next-auth/react";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";

export function Header(){
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/news.svg" alt="news" />
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/" >
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink> 
                </nav>
                <SessionProvider>
                    <SignInButton />
                </SessionProvider>
                
            </div>
        </header>
    );
}
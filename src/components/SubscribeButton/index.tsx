import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss"

interface SubscribeButtonProps{
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps){

    const {data: session, status} = useSession()
    const router = useRouter()

    async function handleSubscribe(){
        if(status !== "authenticated"){
            signIn("github")
            return;
        } else {

            if ((await session).activeSubscription){
                router.push("/posts");
                return;
            } else {

                try{

                    const response = await api.post("/subscribe")

                    const { sessionId } = response.data;

                    const stripe = await getStripeJs()

                    await stripe.redirectToCheckout( { sessionId } )

                } catch (err) {
                    alert(err.message);
                }
            }
        }
    }

    return (

        <button 
            className={styles.subscribeButton} 
            type="button"
            onClick={handleSubscribe}
        >
            Subscribe
        </button>

    );
}
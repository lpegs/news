import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb"
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST"){

        const session = await getSession({ req })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {

            const stripeCustomer = await stripe.customers.create({
                email : session.user.email,
                // metadata
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    { 
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            customerId = stripeCustomer.id

        }

        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            success_url: "http://localhost:3000/posts",
            cancel_url: "http://localhost:3000/",
            line_items: [
                { 
                    price: "price_1KoY6yJjPpl0p5wU0sHllyiF", 
                    quantity: 1 
                },
            ],
            mode: "subscription",
            customer: customerId,
        })

        // return res.redirect(303, stripeCheckoutSession.url)
        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    } else {
        res.setHeader("Allow", "POST")
        res.status(405).end("Method not allowed.")
    }
}
import Stripe from "stripe";

export var stripe = new Stripe(
    process.env.STRIPE_API_KEY,
    {
        apiVersion: "2020-08-27",
        appInfo: {
            name: "news",
            version: "0.1.0"
        },
    }
);
import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export default stripe;

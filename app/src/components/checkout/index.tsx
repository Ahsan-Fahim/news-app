"use client";
// ** React Imports
import { useState, Fragment, useEffect } from "react";
import { redirect } from "next/navigation";

import stripeJs, { loadStripe, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./checkoutForm";
// import PricingFooter from 'src/views/pages/pricing/PricingFooter'

import { IntentBody } from "./type";

import { createIntent, getInvoices } from "@/server/invoice.action";
import { IUser } from "@/types/apps/user";
import { Skeleton } from "../ui/skeleton";

const stripePromise = loadStripe(
  "pk_test_51Hso8uArFHWptmq0KKLSl7HJGJsm3W4USLknsTF8GifRXnGDYDKtxiqtZZ7ckZrOdpXZZHHeUs0WqAyxjkNlR5CR00eGOajHbA"
);
// pk_test_51MFR2TIadObZ2b5rMClrfGQqKXqrJD3ZwO7Oy3THjAVxmsNifhkcNVLkCVOZyn5hVyonASBfle6A4MDgDkJCqF0Q00TsDGn1Rg
// sk_test_51MFR2TIadObZ2b5rh7mfKwSaAbNLgR0QxgTSIWNUlzBD0M6RQYDg4YVI7RzLzZOg2pbkrqSZlJyIWP2Ye8JDWG35004dE9L9oI
interface Props {
  user: IUser;
}
const Checkout: React.FC<Props> = () => {
  const [paymentIntent, setPaymentIntent] =
    useState<stripeJs.PaymentIntent | null>(null);

  const appearance: Appearance = {
    theme: "stripe",
  };

  const createPaymentIntent = () => {
    createIntent()
      .then(async ({ data: response }) => {
        setPaymentIntent(response.payment);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function createPaymentIntentHandler() {
    createPaymentIntent();
  }

  useEffect(() => {
    const user = window.localStorage.getItem("userData");
    if (!user) {
      redirect("/auth/login");
    }
    const data = JSON.parse(user);
    if (data.stripe_customerId) {
      redirect("/apps/news");
    }

    createPaymentIntentHandler();

    return () => {
      setPaymentIntent(null);
    };
  }, []);

  return (
    <Fragment>
      {paymentIntent ? (
        <Elements
          options={{
            appearance,
            clientSecret: paymentIntent.client_secret
              ? paymentIntent.client_secret
              : "",
          }}
          stripe={stripePromise}
        >
          <CheckoutForm paymentIntent={paymentIntent} />
        </Elements>
      ) : (
        <Skeleton className="h-4 w-[200px]" />
      )}
    </Fragment>
  );
};

export default Checkout;

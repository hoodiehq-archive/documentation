# Hoodie Payments

This document describes how Hoodie payments work.

NOTE THAT THIS IS A WISHLIST DOCUMENT

Jaw drop level three: Maximum Droppage.


## Gateway

Hoodie is too lazy to do the hard work, and luckily there there are capable people who can help with all the nitty gritty details of online payments.

### Stripe

We are using [Stripe](http://stripe.com) as our payment gateway. They are awesome.

We may be integrating with other providers at some point, but not right now. High on our list is Braintree. Not on our list is PayPal, but you might be able ot convince us.


## Prerequisites

Payments are hard and this is no exception, but we are trying to make it extra easy for you.

### A Stripe Account

Just leave your Stripe API key with Hoodie and it’ll tell Stripe to send all money that your app makes to your Stripe account and subsequently to your bank account.


## The API

### Paid Accounts (Recurring Payments)

The most common case for Hoodie Payments are paid accounts. You have hoodie app that does something useful for your users and you want to be able to charge them. Different accounts might have different capabilities, so you have different tiers of “plans”.

After enabling Hoodie Payments in our backend, you will be able to create one or more plans [LINK](TBD). Each plan has a a recurring amount, a payment cycle (monthly, yearly) and a unique id.

#### New Accounts with Plans

When new users sign up and you want them to choose a plan, you can get plan info via the `hoodie.payments` API:

    var hoodie = new Hoodie(url);
    hoodie.payments.plans.list(function(plan) {
        /*
        plan = {
            name "Gold Master",
            amount: 10,
            currency: "USD",
            cycle: "month",
            id: "plan_1234"
        }
        */
    });

To sign up a user with this plan, you can use:

    var hoodie = new Hoodie(url);
    hoodie.account.sign_up("joe@example.com", "secret", {plan: "plan_1234"});

Alternatively, you can just pass in a `plan` object:

    var gold_master = hoodie.payments.plans.get("plan_1234");
    hoodie.account.sign_up("joe@example.com", "secret", {plan: gold_master});

#### Account Upgrades and Downgrades

If you allow sign ups without plans and want to be able to upgrade accounts to paid accounts later, or if your users should be able to change plans on their current accounts, you can use `hoodie.account.update`:

    hoodie.account.update({plan: "plan_1234"});

// TBD: discuss re-authentication

### Coupons and Discounts

TBD

### One Time Purchases

If you want to do a one-time charge, the `payments.charge` method is for you:

    var hoodie = new Hoodie(url);
    var charge = {
        amount: 10,
        currency: USD,
        id: "12345"
    };
    hoodie.payments.charge(charge);

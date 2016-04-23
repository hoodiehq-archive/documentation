---
layout: layout-api
locales: fr
---

# Hoodie Payments

Ce document décrit comment les paiements Hoodie fonctionnent.

NOTEZ QU'IL S'AGIT D'UN DOCUMENT DE FONCTIONS ATTENDUES

(NdT: commentaire sans intérêt retiré concernant des mâchoires qui tombent par terre...)

## Passerelle

Hoodie est trop fainéant pour faire le travail, fort heureusement il y a des gens capables qui peuvent aider à gérer tous les menus détails des paiements en ligne.

### Stripe

Nous utilisons [Stripe](http://stripe.com) comme passerelle de paiement. Ils sont fantastiques.

Nous pourrions intégrer d'autres fournisseurs à un moment, mais pas pour l'instant. En haut de la liste se trouve Braintree. N'est pas sur la liste PayPal, mais vous devriez arriver à nous convaincre.


## Pré-requis

Les paiements sont difficiles et il n'y a pas d'exception, mais nous essayons de les rendre très facile pour vous.

### Un compte Stripe

Indiquez votre clef d'API Stripe à Hoodie et il dira à Stripe d'envoyer l'argent que votre application gagne à votre compte Stripe et ensuite à votre compte bancaire.


## L'API

### Comptes payants (paiements récurrents)

Le cas d'usage le plus commun pour les paiements dans Hoodie sont les comptes payants. Vous avez une application Hoodie qui faire quelque-chose d'utile pour vous utilisateurs et vous voulez être en mesure de leur facturer. Différents comptes peuvent avoir différentes capacités, aussi vous avez différents "plans".

Après avoir activé Hoodie Payment sur votre backend, vous serez capable de créer un ou plusieurs plans [LINK](TODO). Chaque plan possède un montant récurrent, un cycle de paiement (par mois, par an) et un id unique.

#### Nouveaux comptes avec plan

Quand de nouveaux utilisateurs s'enregistrent et que vous voulez qu'ils choisissent un plan, vous pouvez récupérer les informations des plans via l'API `hoodie.payments`:

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

Pour enregistrer un utilisateur avec ce plan, vous pouvez utiliser:

    var hoodie = new Hoodie(url);
    hoodie.account.sign_up("joe@example.com", "secret", {plan: "plan_1234"});

Vous pouvez aussi passer un objet `plan`:

    var gold_master = hoodie.payments.plans.get("plan_1234");
    hoodie.account.sign_up("joe@example.com", "secret", {plan: gold_master});

#### Upgrade et downgrade de compte

Si vous autorisez vos utilisateurs à s'enregistrer sans plan et que vous voulez pouvoir améliorer vers un compte payant plus tard, ou si vous utilisateurs doivent pouvoir changer de plan sur leur compte, vous pouvez utiliser `hoodie.account.update`:

    hoodie.account.update({plan: "plan_1234"});

// TODO: discuter de la ré-authentification

### Coupons and Rabais

TODO

### Achats unitaires

Si vous voulez réaliser une facturation unitaire, la méthode `payments.charge` est pour vous:

    var hoodie = new Hoodie(url);
    var charge = {
        amount: 10,
        currency: USD,
        id: "12345"
    };
    hoodie.payments.charge(charge);

---
layout: layout-api
locales: fr
---

# Guide de l'API Hoodie

Le guide Hoodie est une version spéciale de la documentation de l'API pour les développeurs débutants, intermédiaires et avancés qui souhaite avoir une API joliment documentée avec des informations additionnelles  et des exemples de code. Pour le moment, il couvre l'API coeur ainsi que certains des plugins issus du projet Hoodie lui-même.

## 1. L'API Hoodie client

Cette bibliothèque, usuellement appelée **hoodie.js**, sera celle avec laquelle vous travaillerez côté client. Elle consiste en&#x202F;:

- [L'API Hoodie](/fr/techdocs/api/client/hoodie.html), qui contient un certain nombre d'aides pour la connexion et la prise en compte d'événements
- [L'API des comptes utilisateurs](/fr/techdocs/api/client/hoodie.account.html), qui vous laisse réaliser l'authentification utilisateurs, à savoir l'enregistrement, la connexion et la déconnexion
- [L'API stockage](/fr/techdocs/api/client/hoodie.store.html), qui fournit les moyens de stocker et récupérer les données de chaque utilisateur

## 2. Les APIs des plugins Hoodie de base

Nous fournissons quelques plugins pour Hoodie nous-même, et certain d'entre eux ont leur API détaillée ici. Ces plugins peuvent gérer un certain nombre de choses, cas [Hoodie est extensible sur tous les fronts](/fr/plugins/tutorial.html), mais ici nous ne couvrirons que ce que nous appelons les *plugins coeurs*, qui sont inclus dans toute installation Hoodie par défaut.

---
layout: layout-api
locales: fr
---

# Hoodie.Task

Cette classe défini l'API que hoodie.store (dépôt local) et hoodie.open (dépôt distant) implémente pour assurer une API cohérente. Elle implémente aussi les validations de base.

L'API retour (NdT&#x202F;:&#x202F;???) peut être appelé comme une fonction retournant un dépôt ciblé par le type passé, par exemple&#x202F;:

<pre><code>var taskStore = hoodie.store('task');
taskStore.findAll().done( showAllTasks );
taskStore.update('id123', {done: true});
</code></pre>

## Méthodes de classe
- [store](#store)

## Méthodes d'instance
- [validate](#validate)
- [save](#save)
- [add](#add)
- [find](#find)
- [findOrAdd](#findOrAdd)
- [findAll](#findAll)
- [update](#update)
- [updateAll](#updateAll)
- [remove](#remove)
- [removeAll](#removeAll)
- [decoratePromises](#decoratePromises)
- [trigger](#trigger)
- [on](#on)
- [unbind](#unbind)




## Méthodes de classe
### store<a id="store"></a>

Il est plus que probable que votre application aura plus d'un type d'objet à stocker. Même si vous n'avez qu'un seul objet.

## Méthodes d'instance

<a id="validate"></a>
### validate

<a id="save"></a>
### save

<a id="add"></a>
### add

Crée une nouvelle entrée dans le dépôt local.

<pre><code>hoodie.store.add('todo', { title: 'Getting Coffee' });</code></pre>

<a id="find"></a>
### find

<a id="findOrAdd"></a>
### findOrAdd

##### hoodie.store.findOrAdd(type, id, properties)

C'est une combinaison pratique de hoodie.store.find et hoodie.store.add. Utilisez-la quand vous voulez travailler avec un objet du dépôt en particulier pour lequel vous n'êtes pas sûr de l'existance. Dans quels cas cela vaut la peine de l'utiliser&#x202F;? Par exemple quand vous lisez un objet de paramètres avec lequel vous voulez travailler ensuite.

<pre><code>// pre-conditions: vous avez déjà récupéré un objet utilisateur
var configBlueprint = { 
    language: 'en/en', 
    appTheme: 'default' 
};
var configId = account.id + '_config';

hoodie.store
    .findOrCreate(
        'custom-config', 
        configId, 
        configBlueprint
    )
    .done(function(appConfig) { 
        console.log('work with config', appConfig) 
    });
</code></pre>

hoodie.store.findOrCreate prends ici trois arguments. Tous sont requis.

 * **type**&#x202F;: le genre de document que vous voulez chercher.
 * **id**&#x202F;: l'id unique du document que vous recherchez dans le dépôt.
 * **properties**&#x202F;: le modèle du document à créer, au cas où aucun ne serait trouvé.

La chose importante à noter ici est que le paramètre **properties** n'a aucune influence sur la recherche elle-même. Contrairement aux recherches que vous auriez pu utiliser sur d'autres frameworks, ceci n'utilisera **pas** le paramètre **properties** comme condition pour retenir une entrée particulière du dépôt.Les seules conditions de recherche sont le **type** de document et son **id**.

Juste pour démontrer la facilité d'utilisation de hoodie.store.findOrAdd, l'exemple ci-dessous illustre les manières alternatives et plus complexes de recherche et d'ajout&#x202F;:

<pre><code>// pre-conditions: vous avez déjà récupéré un objet utilisateur
var defaultConfig = {
    language: 'en/en', 
    appTheme: 'default'
};

var configId = account.id + '_config';

hoodie.store
    .find('custom-config', configId, configBlueprint)
    .done(function(appConfig) {
        console.log('work with config', appConfig);

        if(appConfig === undefined) {
            hoodie.store
                .add('custom-config', bluePrint)
                .done(function(newConfig) {
                    // on travaille avec newConfig ici
                });
        }
    });
</code></pre>

<a id="findAll"></a>
### findAll

<a id="update"></a>
### update

<a id="updateAll"></a>
### updateAll

<a id="remove"></a>
### remove

<a id="removeAll"></a>
### removeAll

<a id="decoratePromises"></a>
### decoratePromises

<a id="trigger"></a>
### trigger

<a id="on"></a>
### on

<a id="unbind"></a>
### unbind

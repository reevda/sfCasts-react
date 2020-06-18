# Notes de cours
Tuto: https://symfonycasts.com/screencast/reactjs  
Config [React sur PHPStorm](https://stackoverflow.com/questions/46871567/webstorm-auto-completion-does-not-work-for-react-js/46871647)
  
Démarrer le serveur PHP: `symfony console server:run`  
User: ron_furgandy / pumpup   
## 1 React & ESLint
> `$ yarn add eslint --dev`  // sert à trouver les erreurs de code en JS  
> `$ yarn add eslint-plugin-react --dev`  

Ajouter le fichier *.eslintrc.js* à la racine du projet   
Vérifier le code avec la commande `./node_modules/.bin/eslint assets`  
Cocher l'option ESlint dans phpStorm

## 2 React.createElement()
##### Installation de React:
> `$ yarn add react react-dom --dev`
  
`import React from 'react';`  
`import ReactDom from 'react-dom';`  
`const el = React.createElement('h2', null, 'LiftHistory!');`  *// 4è arg: ajout d'un élément enfant*    
`ReactDom.render(el, document.getElementById('lift-stuff-app'));`

## 3 JSX (création d'objets react element)
##### Installer le paquet Babel:
> `$ yarn add babel-preset-react --dev`  
JSX est une extension de Javascript. Pour que la transpileur puisse le transformer en JS, il faut le signaler dans le la configuration de webpack:
`.enableReactPreset()` + redémarrer Webpack + PhpStorm

Le script peut désormais s'écrire comme suit:  
`const el = <h2>Lift stuff! <span>❤️</span></h2>`

## 4 React Components
##### Depuis le fichier JS principal, on appelle les composants comme suit:
*// rep_log_react.js*  
`Import React from 'react';`  
`Import { render } from 'react-dom';`  
`Import RepLogApp from "./RepLog/RepLogApp";`     

`render(<RepLogApp />, document.getElementById('lift-stuff-app'));` *//ne peut retourner qu'un seul élément*  
S'il y a plusieur éléments,il faut l'entourer par un `<div>`

## 5 Les Props
Les Props sont des constantes ou immutables  
Les Props sont des variables que l'on peut passer à l'appel d'un composant:  
`…const shouldShowHeart = true;`  
render(<RepLogApp withHeart={shouldShowHeart} />,    
    document.getElementById('lift-stuff-app')    
);  
Le Prop est utilisé comme suit dans le Component:  
`render() {
	If( this.props.witHeart ) { … }
}`

## 6 collection & Rendering a table
Si on reprend du code Twig et qu'on le copie dans un fichier JS, PhpStorm convertir les class en ClassName
	1. Une des pratiques est de créer une fonction map sur une collection, qui retourne la syntaxe html.
const repLogElement = repLogs.map( (replog) => {
	return(
		<tr key = {replog.id}>   // l'attribut key est obligatoire comme identifiant unique !
			<td>{replog.itemLabel}</td>
			<td>{replog.reps}</td>
			<td>{replog.totalWeightLifted}</td>
			<td>...</td>
		</tr>
	);
})
Cette fonction est ensuite appelée dans le return de render:
<tbody>
{repLogElement}
</tbody>

	2. Une autre pratique est d'insérer la fonction directement à l'endroit du return de render:
<tbody>
{repLogs.map( (replog) => (   // si une fonction ne retourne qu'un objet, il n'y a pas besoin des {} et du return
	<tr key={replog.id}>
		<td>{replog.itemLabel}</td>
		<td>{replog.reps}</td>
		<td>{replog.totalWeightLifted}</td>
		<td>...</td>
	</tr>
))}
</tbody>


## 8 Build the static App first
Fonctionalité pratique de webpack:
>`$ yarn run encore dev-server`   // démarre un serveur web qui met à disposition les assets. Le browser attend qu'il ait fini de transpiler avant de libérer la page, ce qui assure la prise en compte des derniers changes.

## 9 State
Si on utilise le State pour stocker des données (appelées à être changées), il faut les initialiser:
export default class RepLogApp extends Component{
	constructor(props){
		super(props);
		this.state = {
			highlightedRowId: null
		};
	}
…
render() {   // méthode obligatoire
	const { highlightedRowId } = this.state;  // usual shortcup pattern pour faciliter l'utilisation ultérieure
	…
	<tr key = {repLog.id}
		className = { highlightedRowId === repLog.id ? 'info' : '' }
	>
	…
}
React Developper Tool esxiste pour Chrome ooiu FireFox et permet de voir le code React dans le navigateur

## 10 Event click
Pour ajouter un événement, il suffit d'ajouter la méthode onClick() à l'élément désiré.
…
onClick={ (event) => this.setState( { highlightedRowId: repLog.id, event } )}
…

## 11 child component
Organisation de code: lorsqu'on composant devient trop complexe ou lorsqu'on veut réutiliser la ligique dans d'autres classes, on peut créer une nouvelle classe qui sera appelée dans la première.
Le state est toujour défini dans le Component  parent, puis il est passé dans les props du composant enfant.
<RepLogList highlightedRowId = { highlightedRowId } />
On récupère les variables passé au composant-enfant dans les props:
render(){
	const{highlightedRowId} = this.props;
…

## 12 notifying parent
Il  n'y a pas d'appel possible au parent. La méthode handleClick du parent est passé comme prop au Component enfant:
<RepLogList highlightedRowId = {highlightedRowId} onRowClick={this.handleClick} /> //!\  pas la syntaxe d'appel à la fonction handleClick(), donc sans parenthèses !
Ne pas oublier de binder la fonction dans le contrsucteur:
this.handleRowClick = this.handleRowClick.bind(this);

Dans le Component enfant, on récupère la fonction depuis les Props:
const { highlightedRowId, onRowClick } = this.props;
Et on l'applique à l'élément:
<tr onClick={() => onRowClick(repLog.id)} >…</tr>

On distingue donc deux sortes de Components: 
	• Les statefull Componennts - appelés aussi container Components (intelligents)
	• Les stateless Components - appelés presentation Components (passifs)


## 13 Smart vs Dumb Componenents
Tous les Components peuvent avoir un State, mais il ne doit pas être dupliqué sur d'autres Components.
Les presentation Component sont souvent écrits sous forme de fonction, car elle n'ont que la méthode return de render:
export default function RepLogList(props){
	const { highlightedRowId, onRowClick } = this.props;
	…
	Return ( …
Bonne pratique: séparer les fonctions de contrôleur, des fonctions de rendus dans des Components distincts, en nommant RepLogsContainer par exemple.
Pour résumer: 
	• Smart Component -> ne contient pas de html, amis que des commandes
	• Dump Component contient le htnl


## 14 ProtoTypes ou validation des Props
Il faut installer les librairies de Proptypes:
>`$ yarn add prop-types --dev`  
De cette manière, on s'assure que les arguments nécessaire à la classe sont bien passés quand l'objet est appelé:
Import React from 'react';
Import PropTypes from 'prop-types';
…
RepLogList.propTypes={
	highlightedRowId:PropTypes.any,   // any, car on va utiliser un uid
	onRowClick:PropTypes.func.isRequired,   // on s'assur que c'est une fonction qui est passée et qu'elle est obligatoire.
}
D'autre part, le fait d'ajouter les propTypes, l'IDE les utilise pour faire de l'auto-complétion.


## 15 removing PropTypes on production
Les PropTypes ont utilité pour le développement, mais n'apporte rien en production. Certains développeurs les suppriment dans l'environnement de prod. Il faut installer un plugin Babel pour procéder à la suppression:
>`$ yarn add babel-plugin-transform-react-remove-prop-types --dev`  
Comme nous utilisons webpack.Encore, il faut implémenter le plugin dans le fichier de configuration webpack.config.js :
.configureBabel( (babelConfig) => {
	if( Encore.isProduction() ){
		babelConfig.plugins.push(
			'transform-react-remove-prop-types'
		);
	}
})


## 16 Moving Replogs to State
Les données et les fonctions sont toujours passées du haut vers le bas. C'est pourquoi les données doivent se trouver au niveau le plus haut.
Les données du State sont passé au Composant enfant via les Props.

## 17 Spread attributes
Les props et les states peuvent être passés au composant enfant grâce à l'opérateur spread (…myvar)  Ceci ne s'applique qu'à ces deux attributs, les fonctions devant être passées nomément:
return <RepLogs
	{ ...this.props }
	{ ...this.state }
	onRowClick = { this.handleClick }
	repLogs = { this.state.repLogs }
/>


## 18 Handling a form submit
	1. Le principe est toujours le même: pour modifier le State, une fonction est créée au même niveau que le State et sera ensuite transmis dans les composants enfants.
	2. Une fonction est créée au niveau du form avec l'argument "event" qui est passé à la fonction, qui donne accès au form via "event.target". 
	3. La fonction dans le form récupère les données est les transmet au parent.
Convention de nommage: 
	• La méthode commence par handleSomeEvent
	• La prop passée commence par onSomeEvent

On créée la fonction de mise à jour du State dans kle parent
handleNewItemSubmit(event){
	event.preventDefault();
	console.log('Ilove when a good form submits !');
	console.log(event.target);  // affiche la structure du formulaire 
	console.log(event.target.elements.namedItem('reps').value); // récupère la valeur du champ 'reps'
}
On passe la fonction au Composant enfant depuis le render du parent:
return<RepLogs
	{ ...this.props }
	{ ...this.state }
	onRowClick={ this.handleClick }
	repLogs={ this.state.repLogs }
	onNewItemSubmit={ this.handleNewItemSubmit }
/>

On ajoute la fonction dans les propTypes du composant enfant:
RepLogs.propTypes={
	onNewItemSubmit: PropTypes.func.isRequired,
…
On récupère la fonction dans le composant enfant:
Export default function RepLogs( props ){
Let { withHeart, highlightedRowId, onRowClick, repLogs, onNewItemSubmit } = props
On créée la fonction de récupration des données au niveau du form:
function handleFormSubmit(event){
	event.preventDefault();
	console.log('I love when a good form submits !');
	console.log(event.target.elements.namedItem('reps').value);
	onNewItemSubmit(); // retourne les données au composant parent
}
Et on passe la fonction à l'événemnt onSubmit du form:
<form className="form-inline" onSubmit={ handleFormSubmit}>

## 19 New component to hold our form (refs)
Si le form devient complexe, on peut splitter les éléments. Sortons le formulaire dans son propre fichier:
>`export default function RepLogCreator(props){  
>	const{ onNewItemSubmit } = props ;`   // on n'oublie par de le rajouter au ReplogCreator.propTypes  
>	`function handleFormSubmit(event){` // fonction héritée du premier parent  
>		…  
>		`onNewItemSubmit( 'BigFatCat', event.target.elements.namedItem('reps').value );`  
>		…  
>	`return(  
>		<form className="form-inline" onSubmit={ handleFormSubmit }>`    
>	…    
React possède son propre système pour récupérer les valeurs d'un form: les Refs. Pour les utiliser le Composant doit être une classe (il ne peut pas être juste une fonction).`  

## 20 les Refs
Il peut arriver occasionnellement que l'on doive accéder à des éléments du DOM. Par exemple, on veut lire une valeur d'un champ, appeler focus() sur un élément ou intégrer une librairie tièrce JS qui a besoin qu'on lui passe un élément du DOM.
React nous offre un super système pour accéder à nimporte quel élment du DOM: refs.
Pour accéder aux deux champs du form, il faut initialiser deux propriétés dans le constructeur:
constructor(props){
	…
	this.quantityInput = React.createRef();
	this.itemSelect = React.createRef();
Ensuite, on remplace l'attribut "name" dans chacun des inputs par l'attribut ref:
<select id="rep_log_item"
	ref={this.itemSelect}
…
<input type="number" id="rep_log_reps"
	ref={this.quantityInput}
…
On récupère les objets du DOM dans la fonction callback:
handleFormSubmit(event){
	…
	const quantityInput = this.quantityInput.current;
	const itemSelect = this.itemSelect.current;
On utilise ensuite les valeurs des champs du formulaire, avec une différence pour le type select:
onNewItemSubmit(
	itemSelect.options[itemSelect.selectedIndex].text, // text= étiquete, value=valeur
	quantityInput.value
);
Et dans le Componen parent, on adapte la méthode pour ajouter une nouvelle entrée au tableau:
handleNewItemSubmit( itemLabel, reps ){
	Const repLogs = this.state.repLogs;
	Const newRep = {
		id: 'TODO-id',
		reps: reps,
		itemLabel: itemLabel,
		totalWeightLifted: Math.floor(Math.random() * 50)
	};
	repLogs.push(newRep);                    //   plus joli: this.setState( { repLogs:[...repLogs, newRep] });
	this.setState({ repLogs: repLogs }); // 
}
Sans oublier le binder la fonction dans le constructeur:
this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);

Générer des UUID
Installer le plugin:
>`$ yarn add uuid --dev`  
Importer la librairie dans le Component et ajouter la fonction uuid() où on a besoin d'une identifiant unique:
import{ v4 as uuid } from 'uuid';
…
const newRep={
	id: uuid(),

Réinitialiser les champs form après la soumission
On peut également modifier des éléments du DOM ou les valeurs d'un champ de form avec les refs:
quantityInput.value = '';
itemSelect.selectedIndex = 0;


## 21 Imatability / Don't mutate my state!
Seule l'initialisation des données dans le constructeur est permise avec SetState(), car le state est immutable! La mise à jour ou l'ajout d'un élément à un objet ou à une liste (qui est aussi un objet JS) doit TOUJOURS se faire avec une fonction de callback, qui prend en paramètre le state initial, l'élément à modfier et retourne un nouvel objet ou une nouvelle liste qui sera enregistrée dans le state. On ne change JAMAIS une collection ou un objet dans le state directement!
this.setState( prevState => {
	return{ repLogs: [...prevState.repLogs, newRep] } ;
});

## 22 Dumb Components with state (form validation)
Il y a 3 sortes de validation possibles: côté serveur, JS et html.
La validation du formulaire dans Rect se fait dans le Component de création du formulaire RepLogCreator.
Pour ce faire, on va utiliser le state dans de ce Component, car le Component principal n'en a pas besoin.

## 23 form validation state
On commence par initialiser le state dans le constructeur:
this.state={
	quantityInputError: ''
};
Ensuite, tester la valeur dans le fonction handleFormSubmit.
if ( quantityInput.value <= 0 ){
	this.setState( {quantityInputError: 'Please enter a value greater than 0'} );
	return;
}
Et à la fin de la fonction, ajouter la réinitialisation du champ si tout s'est bien passé:
this.setState( {quantityInputError: ''} );
Dans le render():
const { quantityInputError } = this.state;  // on récupère la valeur de l'erreur
On ajoute une condition dans la <div> pour changer la couleur en rouge en cas d'erreur:
``<div className={ `form-group ${quantityInputError ? 'has-error' : '' }` }>``  
Et ensuite on ajoute à la suite du champ input:
{ quantityInputError && <span className="help-block">{ quantityInputError }</span> } // ajoute le JSX si l'erreur existe (syntaxe quantityInputError &&, où la suite est valide que si quantityInputError est true
Un peu de cosmétique dans RepLogs:
<divclassName="row"> // on ajoute ce div
	<divclassName="col-md-6">   // on ajoute ce div aussi
		<RepLogCreator
			onAddRepLog={ onAddRepLog }
		/>
	</div>
</div>
Et pour finir la cosmétique, on retire le classe online du form dans RepLogCreator: className="form-inline" 

## 24 Controlled Form Input (autre validation)
Contrairement à la méthode précédemment vue qui est basée sur le DOM, on peut utiliser une autre méthode où on lie le form avec le State, qui sera mis à jour dans le DOM par React.
On ajoute un champ dans RepLogs, qui modifiera le state dans RepLogApp:
return(
	<div className="col-md-7">
		<input type="number"/>
		<table…
	<div/>
On initialise le nombre dans le constructeur de RepLogApp:
this.state={
	numberOfHearts: 1,
On enregistre la propriété dans RepLogs.propTypes :
numberOfHearts:PropTypes.number.isRequired,
Et on l'importe dans les props:
let{ withHeart, highlightedRowId, onRowClick, repLogs, onAddRepLog, numberOfHearts } = props
Et on adapte le nombre de cœurs à afficher:
if( withHeart )heart = <span>{'❤️'.repeat(numberOfHearts)}</span>;
Ce qui diffère dans cette méthode, c'est qu'on va binder le champ input avec le State au lieu de faire un onChange. Pour ce faire, on a joute l'attribut value au champ input:
<input type = "number" value={ numberOfHearts }/>
Cette stratégie de lien le champ sur le state s'appelle a Controlled Component. Pour changer la valeur, on ajouter une nouvelle fonction dans RepLogApp:
handleHeartChange( heartCount ){
	this.setState({
		numberOfHearts: heartCount
	});
}
Qu'on n'oubliera pas de binder: 
this.handleHeartChange=this.handleHeartChange.bind(this);
On passe ensuite la méthode dans les props de RepLogs :
RepLogs.propTypes={
	onHeartChange: PropTypes.func.isRequired,
let{withHeart,highlightedRowId,onRowClick,repLogs,onAddRepLog,numberOfHearts,onHeartChange}=props
On ajoute ensuite onChange dans la balise input:
<input.. onChange={ (e) => onHeartChange(+ e.target.value )}   // le + convertit le valeur en numérique

## 25 Controlled Component Form
Cette méthodolie diffère quelque peu de la précédante, car elle se base sur la validation via le state. C'est le mode recommandé par React. Elle parmet de valider une entrée lors de sa frappe, donc de ne pas avoir attendre le onSubmit. On commence donc par créer 2 entrées dans le state du Component:
this.state={
	selectedItemId: '',
	quantityValue: 0,
On les récupère ensuite dans le render() :
render(){
	const { quantityInputError, selectedItemId, quantityValue } = this.state;
return(
	…
	<selectid="rep_log_item"
	value = { selectedItemId }   // au lieu de ref={ this.quantityInput }
	…
	<input type="number"id="rep_log_reps"
	value = { quantityValue }
	…
On créé les handler pour récupérer le valeurs entrées dans les champs:
handleSelectedItemChange(event){
	this.setState({
		selectedItemId: event.target.value   // mise à jour du state local
	})
}
handleQuantityInputChange(event){
	this.setState({
		quantityValue: event.target.value
	})
}
On lie les méthodes sur les champs avec onChange:
onChange={this.handleQuantityInputChange}
onChange={this.handleSelectedItemChange}
On récupère dans le handleFormSubmit, les deux valeurs depuis le state:
const { selectedItemId, quantityValue } = this.state;
Qu'on peut ensuite utiliser pour valider la saisie:
If ( quantityValue <= 0 ){
	this.setState( {quantityInputError:'Please enter a value greater than 0'} );
	return;
}
Et ensuite utiliser la méthode onAddRepLog poupr remonter les données au state parent:
onAddRepLog(
	itemlabel,
	quantityValue
);


## 25 Deleting items
On ajoute un lien pour supprimer une entrée dans la liste dans RepLogList:
<a href="#"><span className="fafa-trash"></span></a>
On a joute une fonction dans RepLog pour supprimer une entrée du State:
handleDeleteRepLog(id){
	this.setState( prevState => {
		return{   // boucle sur les repLogs et génére une nouvelle liste en ecluant l'id en paramètre
			repLogs: prevState.repLogs.filter( repLog => repLog.id !== id )
		}
	})
}
Et on n'oublie pas de la binder dans le constructeur:
this.handleDeleteRepLog = this.handleDeleteRepLog.bind(this);
On passe la fonction au Composant RepLog puis à RepLogList:
render(){
	return<RepLogs …
		onDeleteRepLog={this.handleDeleteRepLog}
On enregistre ensuite la fonction dans Replogs.protoTypes:
onDeleteRepLog: PropTypes.func.isRequired,
Et on récupère la fonction dans les props de RepLog, qu'on passe ensuite à <RepLogList :
let{ … ,onDeleteRepLog} = props
…
<RepLogList onDeleteRepLog={ onDeleteRepLog } … />
Et on récupère la fonction dans RepLogList après l'avoir ajouté dans RepLogList.protoTypes :
onDeleteRepLog:PropTypes.func.isRequired,
…
const{ highlightedRowId ,onRowClick, onDeleteRepLog, repLogs } = props;
On créée la fonction handleDeleteClick et on l'assigne au lien de la corbeille:
const handleDeleteClick = function( event, repLogId ){
	event.preventDefault();
	onDeleteRepLog( repLogId );
}

## 26 API setup & Ajax fetch()
On créée un nouveau fichier api/api_rep_log.js qui sera responsable d'aller chercher les données vers les endpoints (un fichier par ressources). Le nom du fichier est en minuscules, car il n'exporte pas de classe, mais des fonctions :
/**
*ReturnsaPromiseobjectwiththereplogsdata
*
*@returns{Promise<any>}
*/
exportfunction getRepLogs(){
	return fetch('/reps', {
		credentials: 'same-origin'   // cette option envoie la requête avec le cookie pour l'authentification de session. Sinon utiliser JAWS ou OAuth
	})
		.then(response=>{
			return response.json().then((data) => data.items);
	});
}

On utilise une fonction présentes dans tous les navigateurs modernes: fetch. Il existe nombre de librairies qui pourraient le faire aussi.

On appelle ensuite la fonction depuis le Component RepAppLog.js :
Import {getRepLogs} from "../api/rep_log_api";
Export default class RepLogApp extends Component{
…
	componentDidMount(){   // une lifecycle method. Se déclenche une fois le rendu fait dans le DOM
		getRepLogs()
			.then((data)=>{
				this.setState({repLogs: data});
			});
	}

## 28 Loading…
L'affichage des données du serveur peut mettre un moment à s'afficher. On peut afficher un message "loading…" avant que Ajax retourne le résultat:
Dans RepLogApp, on ajoute un state:
	isLoaded: false
Quand le fetch est terminé, on met la valeur à true:
componentDidMount(){
	getRepLogs()
		.then((data)=>{
			this.setState({
			repLogs: data,
			isLoaded :true
On passe ensuite le propriété à RepLogs et ensuite à RepLogList, où on retourne Roaldin… si le chargement n'est pas terminé:
if(!isLoaded){
	return(
		<tbody>
			<tr>
				<tdcolSpan="4"className="text-center">Loading...</td>
			</tr>
		</tbody>
	)
}
return(  // la liste avec les éléments
….

## 30  Hittind the Delete endpoint
Le fichier rep_log_api.js gère les connexions au serveur. Pour effacer une entrée, on crée une nouvelle fonction:
export function deleteRepLog(id){
	Return fetch(`/reps/{id}`,{
		credentials: 'same-origin',
		method: 'DELETE'
	});
}
Il suffit ensuite d'appeler la méthode à partir de RepLogApp, après l'avoir importée:
import{ getRepLogs, deleteRepLog } from "../api/rep_log_api";
…
handleDeleteRepLog(id){
	deleteRepLog(id);
…
On peut optimiser le fichier rep_log_api.js, en évitant les répétitions de paramètres à chaque méthode:
Function fetchJson(url, options){
	Return fetch(url, Object.assign({   // idem que array_merge en PHP, mais pour des objets JS
		credentials:"same-origin",
	}, options))
	.then( response => {
		returnresponse.text()
			.then( text => text ? JSON.parse( text ) : '' ); // le delete retourne null
	});
}

Et ensuite on médifie les méthodes existantes:  
`export function getRepLogs(){  
	return fetchJson( '/reps' )  
		.then( data => data.items );  
}`  
`Export function deleteRepLog(id){`  
	``Return fetchJson( `/reps/${id}`, {  ``
		`method:'DELETE'  
	});  
}`

## 31 l'API POST Create
On a joute une nouvelle fonction dans rep_log_api.js:
export function createRepLog(Replog){
	Return fetchJson('/reps',{
		method: 'POST',
		body: JSON.stringify(Replog),
		headers: {
			'Content-type':'application/json',  // fac. mais bonne pratique, car on retourne du json
		}
	})
}
Ensuite, on l'utilise dans RepLogApp, après l'avoir importée:
Import { getRepLogs, deleteRepLog, createRepLog } from"../api/rep_log_api";
createRepLog(newRep);
Et on met ensuite la liste à jour, après avoir attendu le retour d'Ajax:
createRepLog(newRep)
	.then( replog=>{
		this.setState( prevState => {
			Const newRepLog = [...prevState, repLog];
		return{ replogs: newRepLog };
	})
});
On passe les valeurs du formulaire de RepLogCreator:
onAddRepLog(
	itemSelect.options[itemSelect.selectedIndex].value,
	quantityInput.value
);


## 32 Polyfills: fetch & Promise
Fetch est compris par la pluspart des navigateurs (pour les requêtes Ajax), sauf IE11. Pour assurer qu'il soit fonctionnel sur tous les navigateurs, il faut ajouter un polyFill pour fetch et promise:  
>`$ yarn add  whatwg-fetch --dev`  
>`$ yarn add promise-polyfill --dev`  

Pour qu'il soit présent dans toute l'applications, il faut les ajouter au fichier commun: assets/js/layout.js :
`$ import 'whatwg-fetch';`  
`$ import 'promise-polyfill/src/polyfill';`  

Et redémarrer Encore:

>`$ yarn run encore dev-server`

## 33 Success msg & The style attr
On va ajouter une fonction loading… lors de l'enregistrement d'une nouvelle entrée. Dans RepLogApp:
constructor(props){
	this.state={
		isSavingNewRepLog: false
On change le status pendant la requête Ajax:
createRepLog(newRep)
	.then(repLog=>{
		this.setState(prevState => {
			const newRepLog=[...prevState.repLogs, repLog];
			return{
				repLogs: newRepLog,
				isSavingNewRepLog:t rue,
On passe le paramètre à RepLogs puis é ReplLogList, y compris l'ajout dans les propTypes :
isSavingNewRepLog:PropTypes.bool.isRequired
…
Exportdefaultfunction RepLogs(props){
let{
	withHeart,highlightedRowId,onRowClick,repLogs,onAddRepLog,
	numberOfHearts,onHeartChange,onDeleteRepLog,isLoaded ,isSavingNewRepLog
} = props
…
<RepLogListhighlightedRowId={highlightedRowId}onRowClick={onRowClick}repLogs={repLogs}
onDeleteRepLog={onDeleteRepLog}isLoaded={isLoaded}
isSavingNewRepLog = { isSavingNewRepLog } />

// RepLogList:
Et enfin dans le return de RepLogList:
…
{isSavingNewRepLog&&(
<tr>
	<td
		colSpan="4"
		className="text-center"
		style={{   // en JS, le style se passe en mode javascript, donc avec {} et le style exige un objet {}
			opacity: .5
		}}
		>Lifting to the database...</td>
</tr>
)}
</tbody>
// RepLogApp 
On change la valeur de isSavingNewRepLog au début de la recherche et à la fin du callback:
handleAddRepLog(item, reps){
	this.setState({
		isSavingNewRepLog: true   // <--
	});
	constnewRep={
		reps: reps,
		item: item,
	};
	createRepLog(newRep)
		.then(repLog=>{
			this.setState(prevState=>{
				const newRepLog=[ ...prevState.repLogs, repLog];
				return{
					repLogs: newRepLog,
					isSavingNewRepLog: false,  // <--
				};
			})
	});
}

Success message
On ajoute un nouveau paramètre dans le state de RepLog:
	successMessage: ''
On met le message à la fin de createRepLog:
return{
	repLogs: newRepLog,
	isSavingNewRepLog: false,
	successMessage: 'Rep Log saved !'
Le prop est passé à RepLogs et ajouté dans les propTypes:
successMessage:PropTypes.string.isRequired
Et enfin on affiche le message au-desus du tableau dans RepLogs :
{successMessage &&(  // && est un raccourci : est-ce que la condition est positive
	<divclassName="alertalert-successmessage-center">
		{successMessage}
	</div>
)}

 ## 34 Messages temporaire et componentWillUnmont
Le message restera affiché si on ne le supprime pas après quelques secondes. On ajout une fonction de mise à jour de mesasge avec la fonction native setTimeout() dans RepLogApp:
setSuccessMessage(message){   // on pourra la réutiliser pour d'autres messages
	this.setState({
		successMessage:message
	});
}
On appelle la fonction en-dehors du setState quand il y a une mise à jour:
createRepLog(newRep)
	.then(repLog=>{
		this.setState(prevState=>{
			constnewRepLog=[...prevState.repLogs, repLog];
			return{
				repLogs:newRepLog,
				isSavingNewRepLog:false,
			};
		})
	this.setSuccessMessage('Rep Log saved !');
On ajout ensuite un timer pour supprimer le message après 3 secondes:
setSuccessMessage(message){
	this.setState({
		successMessage: message
	});
	setTimeout(()=>{
		this.setState({
			successMessage: ''
		});
	}, 3000);
}
Sauf que si un autre message s'affiche après 2 secondes, il ne sera affiché que pour 1 seconde. On peut régler le problème comme suite:
On crée un nouvel atribut qui recevra l'id retourné par setTimout() et on l'initialise à 0 :
this.successsMessageTimeoutHandler = 0;
on ajoute avant l'appel de setTimeOut(), une fonction 
on réassigne la valeur du nouveau setTimeout() et on remet le compteur à 0 :
setSuccessMessage(message){
	this.setState({
		successMessage:message
	});
	clearTimeout(this.successsMessageTimeoutHandler);
	this.successsMessageTimeoutHandler=setTimeout(()=>{
		this.setState({
		successMessage:''
		});
	}, 3000);
	this.successsMessageTimeoutHandler = 0;
}
Il y a encore un petit souci, si le composant est détruit avant que le setTimeout ait été appelé. La méthode componentWillunmont de Reat est déclenché juste avant que l'élément soit détruit. Pour faire les choses proprement, on peut donc remettre à zéro le compteur dans cette fonction, au cas où…
componentWillUnmount(){
	clearTimeout(this.successsMessageTimeoutHandler);
}
Peut aussi servir si on utilise une librairie externe pour modifier un Dum Component.

## 35 Updating deep State Data
On veut mettre le style de la ligne qui est en train d'être effacée avec une opacité à .3
Pour ce faire, dans le méthode handledeleterepLog, on va ajouter un setState avant l'appel de la fonction d'effacement. Dans le setState, on va ajouter un attribut isDeleting à l'entrée en train d'être effacée avec la fonction map. :
handleDeleteRepLog(id){
	this.setState((prevState)=>{
		return{
			repLogs: prevState.repLogs.map( repLog => {
				if(replog.id !== id){
					Return repLog
				}
				return Object.assign( {}, repLog, { isDeleting:true })  // assign = array_merge en php, mais pour les objets. Ajoute l'attribut à repLog et à l'objet vide -> nouvel O.
			})
		}
	})
	deleteRepLog(id)
		.then( () => {
			this.setState( prevState => {   // on rafraîchit la liste après leffacement sur le serveur
				return{
					repLogs:prevState.repLogs.filter(repLog => repLog.id !== id)
				}
			})
			this.setSuccessMessage('ItemwasUn-lifted!');
		});
}
Et on ajoute un peu de code dans l'affichage dans RepLogList :
return(
	<tbody>
		{repLogs.map((repLog)=>(
		<tr
			key={ repLog.id }
			className={ highlightedRowId === repLog.id ? 'info': '' }
			onClick={ () => onRowClick(repLog.id) }
			style={ {opacity: repLog.isDeleting ? .3 : 1} }
		>

## 36 server validation & fetch  Failing
Prise en compte du retour de la requête Ajax.
Il faut ajouter une méthode qui vérifie le code retourné par la requête dans rep_log_api.js :
functioncheckStatus(response){
	if(response.status >= 200 && response.status < 400){  //jQuery teste entre 200 et 300
		Return response;
	}
	const error = new Error(response.statusText);
	error.response = response;
	throw error
}
Ensuite, on tests la réponse:
functionfetchJson(url,options){
	returnfetch(url,Object.assign({
		credentials: 'same-origin',
		}, options))
		.then(checkStatus) // <--
		.then(response=>{
			returnresponse.text()
				.then( text => text ? JSON.parse(text) : '' );
	});
}

## 37 Displaying Server Validation Erros
Comme nous avons implémenté un "throw" ci-dessus, on peut paturer une éventuelle erreur avec un catch après l'éxécution de la fonction createRepLog dans RepLogApp :
createRepLog(newRep)
	.then(repLog=>{
		this.setState(prevState=>{
			constnewRepLog=[...prevState.repLogs,repLog];
			return{
				repLogs:newRepLog,
				isSavingNewRepLog:false,
			};
		})
		this.setSuccessMessage('RepLogsaved!');
	})
	.catch(error=>{  // <--
		error.response.json().then( errorData => {  // json() est un promise, suit d'un then
			console.log( errorData );
		});
	});
On va maintenant afficher la première erreur au-dessus du formulaire. On pourrait affichier toutes les erreurs en bouclant sur les erreurs. Le traitement se fait dans ReplLogApp, car il s'agit de validation "business" côté serveur que seul ce Component connaît, contrairement aux validations de formulaire qui peut se faire dans le Component contenant le formulaire.
On commence par créer une nouvelle entrée dans le State: 
this.state={
	newRepLogValidationErrorMessage:  ''
On le réinitialise dans dans la fonction createRepLog pour supprimer un éventuel ancien message:
createRepLog(newRep)
	.then(repLog=>{
		this.setState(prevState=>{
			const newRepLog = [ ...prevState.repLogs, repLog];
			return{
				repLogs:newRepLog,
				isSavingNewRepLog:false,
				newRepLogValidationErrorMessage: '' //<--
On récupère ensuite le premier message d'erreur dans le catch:
.catch(error=>{
	error.response.json().then( errorsData => {
		const errors = errorsData.errors;
		const firstError = errors[Object.keys(errors)[0]]
			this.setState({
				newRepLogValidationErrorMessage: firstError
		});
	});
});
On le passe ensuite é RepLogs et ensuite à RepLoCreator, y compris dans les propTypes:
// RepLogs
<RepLogCreator
	onAddRepLog={onAddRepLog}
	validationErrorMessage={newRepLogValidationErrorMessage} // on renomme le message, car il pourra être utilisé pour le mode édition, pas que le mode création.
//RepLogCreator (dans le render() ) :
const { validationErrorMessage } = this.props;
…
return(
<form onSubmit={ this.handleFormSubmit }>
	{ validationErrorMessage && (
		<div className="alert alert-danger">
			{ validationErrorMessage }
		</div>
	)}
…
On peut modifier le message si on utilise les Form de Symfony, en ajoutant une option dans RepLogType:
…
	'invalid_message' => 'Pleaseliftsomethingthatisunderstoodbyourscientists.'

## 38 …Object Rest spread
On peut ajouter un plugin à Babel pour pouvoir utiliser l'opérateur spread (…), aux objets de la même manière qu'ES6 le permet pour les arrays. :
>`$ yarn add babel-plugin-transform-object-rest-spread --dev`  

Il faut ensuite l'ajouter dans la configuration Babel de Webpack dans webpack.config.js :
`.configureBabel( (babelConfig) => {   
	if(Encore.isProduction()){  
		babelConfig.plugins.push(  
			'transform-react-remove-prop-types'  
		);    
	}    
	babelConfig.plugins.push('transform-object-rest-spread');  
})`

Il faut encore modifier le fichier de config .eslintrc.js pour que PHPStorm ne signale par d'erreur avec la syntaxe …Object :
Babel >= v6 -> ecmaVersion: 2018,  // au lieu de ecaVersion: 6,
Babel <  v6 :
	parseOptions: {
		ecmaFeatures: {
			jsx: true,
			experimentalObjectRestSpread: true
		}

Et on redémarre encore: `$ yarn dev-server`  
On peut ensuite remplacer la syntaxe 
returnObject.assign({
	repLogs: newRepLogs,
	newRepLogValidationErrorMessage: '',
	}, newState);
On peiut également remplacer la syntaxe dans la fonction handleDeleteRepLog:
return { ...repLog, isDeleting: true }
Au lieu de 
Return Object.assign( {}, repLog, { isDeleting: true } )

## 39 Passing Data from server to React
Pour populer la liste des options du formulaire, nous avons créé les données directement dans RepLogCreator, ce qui est bien quand les valeurs ne changent pas. Si elles sont appelées à changer, il faut les instancier dans RepLogApp et on aura la possibilité de les charger, soit au chargement dans la page en rendant une variable globale avec Twig, ou de faire un appel Ajax dans la fonction componentDidMount().
On commence par prendre la liste des options de RepLogCreator et on la remonte dans RepLogApp:
this.state={
	…
	itemOptions:[
		{id:"cat",text:"Cat"},
		{id:"fat_cat",text:"BigFatCat"},
		{id:"laptop",text:"MyLaptop"},
		{id:"coffee_cup",text:"CoffeeCup"},
		{id:"invalid_item",text:"DarkMatter"},
	]
On passe ensuite la liste à RepLogs et RepLogCreator, y compris avec le propTypes
RepLogApp : 
Si on ne met pas l'argument à required, il n'y aura pas d'erreur, mais un bug pourra survenir si on oublie de passer la prop à l'élément enfant. Afin d'éviter cela, on peut donner une valeur par défaut à la prop:
RepLogApp.propTypes={
	withHeart:PropTypes.bool,
	itemOptions:PropTypes.array    // <-- /!\ pas required /!\
}
RepLogApp.defaultProps={
	itemOptions: []   // valeur par défaut. La fonction .map n'explosera pas le code, car c'est array vide.
}

RepLogs : 
RepLogs.propTypes = {
	…
	itemOptions: PropTypes.array.isRequired

let { ….., itemOptions }=props
<RepLogCreator
	onAddRepLog = {onAddRepLog}
	validationErrorMessage = {newRepLogValidationErrorMessage}
	itemOptions = {itemOptions} // <--
/>

RepLogCreator : 
RepLogs.propTypes = {
	…
	itemOptions: PropTypes.array.isRequired
render(){
	const{quantityInputError} = this.state;
	const{validationErrorMessage, itemOptions} = this.props;
….
	<option value="">What did you lift ?</option>
	{ itemOptions.map( option => {
		return <option value={ option.id } key={option.id} >{option.text}</option>
	})}
</select>


## 40 Passing Server data to the React Props
On peut stocker les options directement dans le template templates/lift/index.html, dans le block javascript et assigner les valeurs à une variable globales de l'objet window :
`{% block javascripts %}  
	{{ parent() }}  
	<script>  
		window.REP_LOG_APP_PROPS={  
			itemOptions:[  
				{id:'cat',text:'Cat'},  
				{id:'fat_cat',text:'BigFatCat'},  
				{id:'laptop',text:'MyLaptop'},  
				{id:'coffee_cup',text:'CoffeeCup'},  
				{id:'invalid_item',text:'DarkMatter'}  
			]  
		}`  
On peut ensuote les utiliser depuis l'entry point de l'application comme suit:
<RepLogApp withHeart={shouldShowHeart} itemOptions={ window.REP_LOG_APP_PROPS.itemOptions } />,
On pourrait aussi les utiliser directement dans le composant AppLogCreator, sans devoir le passer depuis le composant parent, mais cela n'est pas une bonne pratique. Tous les éléments doivent toujours transiter par le Composant parent, qui lui, est au courant de tout.
On pourrait aussi ajouter d'autre options dans le valriable globale window.REP_LOG_APP_PROPS :
`window.REP_LOG_APP_PROPS={  
	itemOptions:[  
		{id:'cat',text:'Cat'},  
		{id:'fat_cat',text:'BigFatCat'},  
		{id:'laptop',text:'MyLaptop'},  
		{id:'coffee_cup',text:'CoffeeCup'},  
		{id:'invalid_item',text:'DarkMatter'}  
	],  
	withHeart: true  
}`  
Et les récupérer avec la spread operator   
`<RepLogApp withHeart={shouldShowHeart} {...window.REP_LOG_APP_PROPS} />,`

Dumping Javascript in Twig  
J'usqu'ici, rien de très dynamique. Changeons cela  
Dans le LiftController, on récupère les options du select, que l'on passe en paramètres à l'affichage de index.html.twig. Ensuite, on assigne les valeurs dans la variable globale de window dans la balise `<script>` de la page index.html.twig. Ne reste plus qu'à les passer au formulaire dans RepLoggApp jusqu'à RepLogCreator pour créer les valeurs dans le formulaire.
 public function indexAction(..) {
>	`$ repLogAppProps=[
>			'withHeart'=>true,
>			'itemOptions'=>[]
>		];
>	foreach( RepLog::getThingsYouCanLiftChoices() as $label => $id ){
>		$repLogAppProps['itemOptions'][]=[
>			'id' => $id,
>			'text' => $translator->trans($label)
>		];
>	}`
>		
>	return$this->render('lift/index.html.twig',array(
>		'leaderboard'=>$this->getLeaders($replogRepo,$userRepo),
>		'repLogAppProps' => $repLogAppProps,  // <--
>	));

Et dans index.html.twig :  
`<script>
	window.REP_LOG_APP_PROPS={{ repLogAppProps|json_encode|raw }}
</script>`  
Que l'on peut ensuite récupérer dans l'entrypoint rep_log_react.js :  
`render(  
	<RepLogApp withHeart={shouldShowHeart} {...window.REP_LOG_APP_PROPS} />,  
	document.getElementById('lift-stuff-app')  
);`


## 41 Reusable components
React est conçu de manière à pouvoir réutiliser ses Components. 
On créé un fichier avec le Component Button dans assets/js/Components/Button.js :
Import React, { Component } from 'react';
Import PropTypes from 'prop-types';

`export default function Button( props ){  
	const{ className, ...otherProps } = props;  // permet de séparer className des autres props  
	return(  
		<button`  
			``className={ `btn ${className}` }``  // si on avait pas séparé des props, on écrasait btn  
			`{ ...otherProps }`  // les props sont ajoutés  
		`>{props.children}`  
		`</button>`  
`	)`  
`}`

Button.propTypes = {
	className: PropTypes.string,
};

Button.defaultProps = {
	className: ''
}
On importe le composant dans le Component qui en a besoin:
Import Button from "../Components/Button" ;
Et on l'utilise :
<Button type="submit" className="btn-primary">
	I Lifted it!
</Button>

## 42 CRSF Protection
	• Utiliser les sameSite cookies (configurable dans Symfony)
	• Ne permettre les requêtes que du même site, ou un site explicitement autorisé
	• Format Json

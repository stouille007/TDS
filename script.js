let agents = [];
let calendrier = [];
let encadrement = [];
let Trad_jour = ['D','L','M','M','J','V','S'];
let Trad_Mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];
let DureeDeLaSession = 30;			// Durée de la session en minutes
let pathJson = "https://stouille007.github.io/TDS/";


$(document).ready(function() {
	gestion_menu_navigation_mois();
	construction_select_choix();	
	chargerDonnees().then(() => {
		creation_Tableau();
		});
	$('#prevMonth').click(function() {
		let mois = getParameter("mois");
		let annee = getParameter("annee");
		let choixSel = getParameter("choixSel");
		let id_subdivision = getParameter("id_subdivision");
		let id_pole = getParameter("id_pole");
		if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
		if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
		
		let TextechoixSel = "";
		let Texteid_subdivision = "";
		let Texteid_pole = "";
		
		if (typeof choixSel === "undefined" || choixSel == ""){TextechoixSel = "";} else {TextechoixSel = "&choixSel="+choixSel;}
		if (typeof id_subdivision === "undefined" || id_subdivision == ""){Texteid_subdivision = "";} else {Texteid_subdivision = "&id_subdivision="+id_subdivision;}
		if (typeof id_pole === "undefined" || id_pole == ""){Texteid_pole = "";} else {Texteid_pole = "&id_pole="+id_pole;}
		
		var date = new Date(annee+"-"+mois+"-01");
		date.setMonth(date.getMonth() - 1);
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() + 1)).slice(-2);  
    
		window.location.replace("calendrier.html?mois="+month+"&annee="+year+TextechoixSel+Texteid_subdivision+Texteid_pole);
		});
	$('#nextMonth').click(function() {
		let mois = getParameter("mois");
		let annee = getParameter("annee");
		let id_subdivision = getParameter("id_subdivision");
		let id_pole = getParameter("id_pole");
		let choixSel = getParameter("choixSel");
		if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
		if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
		
		let TextechoixSel = "";
		let Texteid_subdivision = "";
		let Texteid_pole = "";
		
		if (typeof choixSel === "undefined" || choixSel == ""){TextechoixSel = "";} else {TextechoixSel = "&choixSel="+choixSel;}
		if (typeof id_subdivision === "undefined" || id_subdivision == ""){Texteid_subdivision = "";} else {Texteid_subdivision = "&id_subdivision="+id_subdivision;}
		if (typeof id_pole === "undefined" || id_pole == ""){Texteid_pole = "";} else {Texteid_pole = "&id_pole="+id_pole;}
		
		var date = new Date(annee+"-"+mois+"-01");
		date.setMonth(date.getMonth() + 1);
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() + 1)).slice(-2);  
    
		window.location.replace("calendrier.html?mois="+month+"&annee="+year+TextechoixSel+Texteid_subdivision+Texteid_pole);
		});
	$('#btnRefresh').click(function() {
		window.location.reload();
		});
	$('#logo').click(function() {
		window.location.replace("calendrier.html");
		});
	$('#btnLogout').click(function() {
		sessionStorage.removeItem("dC");
		window.location.replace("index.html");
		});
	
	$('#AlertTableau').hide();
				
	if (testSession()){
		tempsSession();
		}
	});
function construction_select_choix(){
	let ChoixSel = getParameter("choixSel");	
	if (typeof ChoixSel === "undefined" || ChoixSel == "" ||  ChoixSel == "service"){		// Vue Service par défaut
		$('.selectionChoix').val("service");
		$('.controlsSubdivision').hide();
		}
	else if (ChoixSel == "pole"){		
		$('.selectionChoix').val("pole");
		construction_select_pole();
		$('.selectionSubdivision').hide();
		}
	else if (ChoixSel == "subdivision"){
		$('.selectionChoix').val("subdivision");
		construction_select_subdivision();
		$('.selectionPole').hide();
		}
	}
function changementSelectChoix(){
	let NewChoice = $(".selectionChoix").val();
	let mois = getParameter("mois");
	let annee = getParameter("annee");
	let choixSel = getParameter("choixSel");
	if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
	if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
	
	let TextechoixSel = "";
	let Texteid_subdivision = "";
	let Texteid_pole = "";
	
	TextechoixSel = "&choixSel="+NewChoice;
	if (typeof id_subdivision === "undefined" || id_subdivision == ""){Texteid_subdivision = "&id_subdivision=0";} else {Texteid_subdivision = "&id_subdivision="+id_subdivision;}
	if (typeof id_pole === "undefined" || id_pole == ""){Texteid_pole = "&id_pole=0";} else {Texteid_pole = "&id_pole="+id_pole;}
	window.location.replace("calendrier.html?mois="+mois+"&annee="+annee+TextechoixSel+Texteid_subdivision+Texteid_pole);
	}
function construction_select_pole(){
	let ChoixSel = getParameter("choixSel");
	return $.getJSON(pathJson+"pole.json")
		.done(function(donnees) {
			pole = donnees.pole || [];
			const $div = $('#selectDiv').empty();
			const $Select = $('<select>').addClass('selectionPole');
			const $option = $('<option>').prop('value',0).text('Choisir un pole');
			$Select.append($option);	
			
			for (var j=0;j<pole.length;j++){
				const $option = $('<option>').prop('value',pole[j].id_pole).text(pole[j].pole);
				$Select.append($option);	
				}
			$div.append($Select);	
			
			
			
			
			let id_pol = getParameter("id_pole");
			if ($.isNumeric(id_pol)) 		{$('.selectionPole').val(id_pol);} 
			else 							{$('.selectionPole').val(0);}
			
			$('.selectionPole').change(function() {
				let NewId = $(this).val();
				let mois = getParameter("mois");
				let annee = getParameter("annee");
				if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
				if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
				window.location.replace("calendrier.html?id_pole="+NewId+"&mois="+mois+"&annee="+annee+"&choixSel=pole");
				});
			
			if (id_pol == 0){
				$('#containerTableau').hide();
				$('#controlsMois').hide();
				$('#AlertTableau').html("Veuillez choisir un Pole dans la liste déroulante çi-dessus pour afficher le tableau de service correspondant");
				$('#AlertTableau').show();
				}
			else{
				$('#containerTableau').show();
				$('#controlsMois').show();
				$('#AlertTableau').hide();
				}
			})
		.fail(function(jqxhr, textStatus, error) {
			$('#partie_tableau_gauche').hide();
			$('#erreur').html("<i class='bi bi-exclamation-triangle-fill'></i><br><br>Problème dans la lecture du fichier subdivision.json");
			console.error("❌ Erreur de chargement JSON :", textStatus, error);
			});		
	}
function construction_select_subdivision(){
	let ChoixSel = getParameter("choixSel");
	return $.getJSON(pathJson+"subdivision.json")
		.done(function(donnees) {
			subdivision = donnees.subdivision || [];
			encadrement = donnees.encadrement || [];
			const $div = $('#selectDiv').empty();
			const $Select = $('<select>').addClass('selectionSubdivision');
			const $option = $('<option>').prop('value',0).text('Choisir une Subdivision');
			const $option1 = $('<option>').prop('value','encadrement').text('Encadrement');
			$Select.append($option);	
			$Select.append($option1);	
			
			for (var j=0;j<subdivision.length;j++){
				const $option = $('<option>').prop('value',subdivision[j].id_subdivision).text(subdivision[j].subdivision);
				$Select.append($option);	
				}
			$div.append($Select);	
			
			let id_sub = getParameter("id_subdivision");
			if ($.isNumeric(id_sub)) 		{$('.selectionSubdivision').val(id_sub);} 
			else 							{$('.selectionSubdivision').val('encadrement');}
			
			$('.selectionSubdivision').change(function() {
				let NewId = $(this).val();
				let mois = getParameter("mois");
				let annee = getParameter("annee");
				if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
				if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
				
				if ($.isNumeric(NewId)){
					window.location.replace("calendrier.html?id_subdivision="+NewId+"&mois="+mois+"&annee="+annee+"&choixSel=subdivision");
					}
				else{
					let chaineEncadrement = "";
					for (var i=0;i<encadrement.length;i++){
						let id = encadrement[i].id_subdivision;
						chaineEncadrement = chaineEncadrement+id+"*";
						}
					window.location.replace("calendrier.html?id_subdivision="+chaineEncadrement+"&mois="+mois+"&annee="+annee+"&choixSel=subdivision");
					}
				});
			
			if (id_sub == 0){
				$('#containerTableau').hide();
				$('#controlsMois').hide();
				$('#AlertTableau').html("Veuillez choisir une subdivision dans la liste déroulante çi-dessus pour afficher le tableau de service correspondant");
				$('#AlertTableau').show();
				}
			else{
				$('#containerTableau').show();
				$('#controlsMois').show();
				$('#AlertTableau').hide();
				}
			})
		.fail(function(jqxhr, textStatus, error) {
			$('#partie_tableau_gauche').hide();
			$('#erreur').html("<i class='bi bi-exclamation-triangle-fill'></i><br><br>Problème dans la lecture du fichier subdivision.json");
			console.error("❌ Erreur de chargement JSON :", textStatus, error);
			});		
	}
function gestion_menu_navigation_mois(){
	let mois = getParameter("mois");
	let annee = getParameter("annee");
	let choixSel = getParameter("choixSel");
	let id_subdivision = getParameter("id_subdivision");
	let id_pole = getParameter("id_pole");
	if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
	if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
	
	let TextechoixSel = "";
	let Texteid_subdivision = "";
	let Texteid_pole = "";
	
	if (typeof choixSel === "undefined" || choixSel == ""){TextechoixSel = "";} else {TextechoixSel = "&choixSel="+choixSel;}
	if (typeof id_subdivision === "undefined" || id_subdivision == ""){Texteid_subdivision = "";} else {Texteid_subdivision = "&id_subdivision="+id_subdivision;}
	if (typeof id_pole === "undefined" || id_pole == ""){Texteid_pole = "";} else {Texteid_pole = "&id_pole="+id_pole;}
	
	let moisAujou  = (new Date).getMonth()+1;
	let anneeAujou  = (new Date).getFullYear();
	let lien = "calendrier.html?mois="+moisAujou+"&annee="+anneeAujou+TextechoixSel+Texteid_subdivision+Texteid_pole;
	let affichage = "<a href='"+lien+"'>"+Trad_Mois[mois-1]+" "+annee+"</a>";
	
	$("#monthRange").html(affichage);
	}		
function creation_Tableau(){
	let mois = getParameter("mois");
	let annee = getParameter("annee");
	if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
	if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
	
	const $theadNum = $('#ligne_numero').empty();
	const $theadJ = $('#ligne_jour').empty();
	const daysInMonth = new Date(annee, mois,0).getDate();
	let dates = [];
	let current = new Date(getFirstMonday(annee, mois));
	
	while (current <= getLastSunday(annee, mois)) {
		let dateObj = new Date(current);
		let addClass = "";
		if (dateObj.getDay() == 6 || dateObj.getDay() == 0)		addClass = "week-end";
		const $thJour = $('<div>')
			.addClass('jourNum '+addClass)
			.prop('id',formatDateToYMD(dateObj))
			.text(dateObj.getDate());
		const $thjOUR = $('<div>')
			.addClass('jourJ '+addClass)
			.prop('id',formatDateToYMD(dateObj))
			.text(Trad_jour[dateObj.getDay()]);
		$theadNum.append($thJour);
		$theadJ.append($thjOUR);
		current.setDate(current.getDate() + 1); 
		}
	
	
	let ChoixSel = getParameter("choixSel");
	if (typeof ChoixSel === "undefined" || ChoixSel == "" || ChoixSel == "service")		{filtrage_Service();}
	else if (ChoixSel == "pole")														{filtrage_Pole();}
	else if (ChoixSel == "subdivision")													{filtrage_Subdivision();}
	aujourdhui();
	}
function chargerDonnees() {
	let mois = getParameter("mois");
	let annee = getParameter("annee");
	if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
	if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
	
	let path = annee+"_"+mois;
	
	return $.getJSON(pathJson+path+".json")
		.done(function(donnees) {
			agents = donnees.agents || [];
			calendrier = donnees.calendrier || [];
			})
		.fail(function(jqxhr, textStatus, error) {
			$('#partie_tableau_gauche').hide();
			$('#erreur').html("<i class='bi bi-exclamation-triangle-fill'></i><br><br>Erreur, le tableau du mois de <u>"+Trad_Mois[mois-1]+" "+annee+"</u> n'a pas été trouvé");
			console.error("❌ Erreur de chargement JSON :", textStatus, error);
			});
	}	
function filtrage_Service(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	
	for (var i=0;i<parseInt(agents.length);i++){
		const $ligneNom = $('<div>').append('<div class="LigneNom">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
		const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
		let ClasseWeek = "";
		$('.jourJ').each(function(cell){
			let idCellule = $(this).prop("id");
			if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
			const $div = $('<div>')
				.addClass('Cellulejour '+ClasseWeek)
				.html("&nbsp;")
				.attr('id', agents[i].id+"_"+idCellule);
			$ligne.append($div);
			});
		$body.append($ligne);
		$partie_tableau_gauche.append($ligneNom);
		}
	remplissage();
	}
function filtrage_Pole(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	
	let id_pole = getParameter("id_pole");
	for (var i=0;i<parseInt(agents.length);i++){
		var idPole = parseInt(agents[i].id_pole);
		
		if (idPole == id_pole){
			const $ligneNom = $('<div>').append('<div class="LigneNom">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
			const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
			let ClasseWeek = "";
			$('.jourJ').each(function(cell){
				let idCellule = $(this).prop("id");
				if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
				const $div = $('<div>')
					.addClass('Cellulejour '+ClasseWeek)
					.html("&nbsp;")
					.attr('id', agents[i].id+"_"+idCellule);
				$ligne.append($div);
				});
			$body.append($ligne);
			$partie_tableau_gauche.append($ligneNom);
			}
		}
	remplissage();
	}
function filtrage_Subdivision(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	
	let id_sub = getParameter("id_subdivision");
	if ($.isNumeric(id_sub)){
		for (var i=0;i<parseInt(agents.length);i++){
			var idSub = parseInt(agents[i].id_subdivision);
			
			if (idSub == id_sub){
				const $ligneNom = $('<div>').append('<div class="LigneNom">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
				const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
				let ClasseWeek = "";
				$('.jourJ').each(function(cell){
					let idCellule = $(this).prop("id");
					if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
					const $div = $('<div>')
						.addClass('Cellulejour '+ClasseWeek)
						.html("&nbsp;")
						.attr('id', agents[i].id+"_"+idCellule);
					$ligne.append($div);
					});
				$body.append($ligne);
				$partie_tableau_gauche.append($ligneNom);
				}
			}
		}
	else{
		let tableauIdEncadrement = id_sub.split('*').filter(Boolean).map(Number); 
		for (var i=0;i<agents.length;i++){
			var idSub = parseInt(agents[i].id_subdivision);
			if ($.inArray(idSub, tableauIdEncadrement) !== -1) {
				const $ligneNom = $('<div>').append('<div class="LigneNom">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
				const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
				let ClasseWeek = "";
				$('.jourJ').each(function(cell){
					let idCellule = $(this).prop("id");
					if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
					const $div = $('<div>')
						.addClass('Cellulejour '+ClasseWeek)
						.html("&nbsp;")
						.attr('id', agents[i].id+"_"+idCellule);
					$ligne.append($div);
					});
				$body.append($ligne);
				$partie_tableau_gauche.append($ligneNom);
				}
			}
		}
	remplissage();
	}
function remplissage(){
	let unitaire = parseInt($('.Cellulejour').css("width"));
	
	$('.CelluleNom').each(function(cell){
		let idAgent = $(this).prop("id");	
		for (var j=0;j<calendrier.length;j++){
			if (calendrier[j].id_agent ==  idAgent){
				let Ladate = calendrier[j].debut;
				let jour = calendrier[j].jour;
				let duree = calendrier[j].duree;
				let coloriage = calendrier[j].coloriage;
				let largeurDiv = parseInt(calendrier[j].duree)*unitaire-2;
				
				let affichage = calendrier[j].jour;
				if (coloriage != "0" && coloriage != 0){
					affichage = affichage+"<sup>"+coloriage+"</sup>";
					}
					
				if (duree > 1){
					let jusqua = ajouterJours(Ladate, parseInt(duree));
					var dateDebut = ajouterJours(Ladate,1);
					var Deb = new Date(dateDebut);
					var dateFin = new Date(jusqua);
					
					for (var date = Deb; date < dateFin; date = ajouterUnJour(new Date(date))) {
						let DateHide = date.toISOString().split('T')[0];
						DateHide = idAgent+"_"+DateHide;
						$('#'+DateHide).hide();
						largeurDiv = largeurDiv+1;
						}
					}
				const $cellule = $('#'+idAgent+'_'+Ladate).empty();
				const $div = $('<div>')
				  .addClass('div')
				  .css('width',largeurDiv+"px")
				  .css('background-color','#'+calendrier[j].background)
				  .css('color','#'+calendrier[j].color)
				  .html(affichage);
				$cellule.append($div);
				}
			}
		});
	miseAuPropre();
	}
function aujourdhui(){
	var today = new Date();
	var yyyy = today.getFullYear();
	var mm = String(today.getMonth() + 1).padStart(2, '0'); 
	var dd = String(today.getDate()).padStart(2, '0');
	var currentDate = yyyy + '-' + mm + '-' + dd;
	
	$('.jourNum').each(function(){
		let id=$(this).prop("id");
		if (currentDate == id){
			$(this).html("<div class='aujourdhui'>"+$(this).text()+"</div>");
			}
		});
	
	}	
function ajouterJours(dateStr, jours) {
	var date = new Date(dateStr);
	date.setDate(date.getDate() + parseInt(jours));
	return date.toISOString().split('T')[0];
	}
function ajouterUnJour(date) {
	date.setDate(date.getDate() + 1);
	return date;
	}	
function miseAuPropre(){
	$('div.LigneNom').last().css({
		'border-bottom': 'none'
		});
	$('div.LigneNom').first().css({
		'border-top': '1px solid #CCCCCC'
		});
	}
function getLastSunday(year, month) {
	let date = new Date(year, month, 0);
	let day = date.getDay();
	date.setDate(date.getDate() - day);
	return date;
	}
function getFirstMonday(year, month) {
	let date = new Date(year, month - 1, 1);
	let day = date.getDay();
	let diff = (day === 0) ? 1 : (8 - day);
	date.setDate(date.getDate() + (day === 1 ? 0 : diff));
	return date;
	}
function getLastDayOfMonth(year, month) {
	return new Date(year, month, 0).getDate();
	}
function mktime(hour,minute,month,day,year){
	return (new Date(year, month, day, hour, minute, 0)).getTime()/1000;
	}
function formatDateToYMD(date) {
	if (!(date instanceof Date) || isNaN(date)) return null;
	let year = date.getFullYear();
	let month = String(date.getMonth() + 1).padStart(2, '0'); // mois commence à 0
	let day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
	}
function getParameter(p){
	var url = window.location.search.substring(1);
	var varUrl = url.split('&');
	for (var i = 0; i < varUrl.length; i++){
		var parameter = varUrl[i].split('=');
		if (parameter[0] == p){
			return parameter[1];
			}
		}
	}
function utf8Decode(str) {
	  try {
		return decodeURIComponent(escape(str));
	  } catch (e) {
		console.error("Erreur de décodage UTF-8 :", e);
		return str;
	  }
	}			
function tempEcoule(debut,fin,choix) {
	let ecartMs = fin - debut; // différence en millisecondes

	let secondes = ecartMs / 1000;
	let minutes = secondes / 60;
	let heures = minutes / 60;

	if (choix == "secondes")		return secondes.toFixed(2);
	if (choix == "minutes")			return minutes.toFixed(2);
	if (choix == "heures")			return heures.toFixed(2);
	}; 
function testSession(){
	let dC = sessionStorage.getItem("dC");
	if (typeof dC != "undefined" && $.isNumeric(dC)){
		if (tempEcoule(dC,Date.now(),'minutes')<=DureeDeLaSession){				// Durée de la cession
			return true;
			}
		else{
			sessionStorage.removeItem("dC");
			return false;	
			}
		}
	else{
		return false;	
		}
	}
function tempsSession(){
	let dC = sessionStorage.getItem("dC");
	let tempDejaEcoule = tempEcoule(dC,Date.now(),'secondes');
	let DureeSesion = DureeDeLaSession*60;
	let deltaResant = DureeSesion-tempDejaEcoule;
	deltaResant = Math.round(deltaResant);
	
	// console.log("Reste : "+deltaResant);
	
	if (deltaResant <= 0){
		sessionStorage.removeItem("dC");
		window.location.replace("index.html");
		}
	else if (deltaResant <= 60){
		if (!$('#divBas').is(':visible')){
			$('#divBas').show().animate({ opacity: 1, bottom: '+=30' }, 800);
			}
		$('#divBas').html("Votre session se fermera dans "+deltaResant+" secondes");
		}
	else{
		$('#divBas').hide();
		}
	calculTempSession();
	}
function calculTempSession(){
	let timer = setTimeout("tempsSession();",1000);
	}

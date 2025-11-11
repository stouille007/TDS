let agents = [];
let calendrier = [];
let encadrement = [];
let Trad_jour = ['D','L','M','M','J','V','S'];
let Trad_Mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];
let DureeDeLaSession = 30;			// Durée de la session en minutes
let pathJson = "https://stouille007.github.io/TDS/";


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
				$('#AlertTableau').html("Veuillez <b>choisir un Pole</b> dans la liste déroulante çi-dessus pour afficher le tableau de service correspondant");
				$('#AlertTableau').show();
				$('#erreur').hide();
				$('#tips').hide();
				}
			else{
				$('#containerTableau').show();
				$('#controlsMois').show();
				$('#erreur').show();
				$('#erreur').show();
				$('#AlertTableau').hide();
				$('#tips').show();
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
				$('#AlertTableau').html("Veuillez <b>choisir une subdivision</b> dans la liste déroulante çi-dessus pour afficher le tableau de service correspondant");
				$('#AlertTableau').show();
				$('#erreur').hide();
				$('#tips').hide();
				}
			else{
				$('#containerTableau').show();
				$('#controlsMois').show();
				$('#AlertTableau').hide();
				$('#erreur').show();
				$('#tips').show();
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
function creation_Tableau_agent(){
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
	filtrage_agent();
	aujourdhui();
	}
function filtrage_agent(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	var TableauDateNb = [];
	$('.jourJ').each(function(cell){
		let idCellule = $(this).prop("id");
		var stats = getSimultaneousTasksPerAgent(idCellule);
		TableauDateNb[idCellule] = getSimultaneousTasksPerAgent(idCellule);
		});	
		
	let id_agent = getParameter("id_agent");
	for (var i=0;i<parseInt(agents.length);i++){
		var idagent = parseInt(agents[i].id);
		
		if (idagent == id_agent){
			$('#rappelAgent').html(agents[i].lastname.toUpperCase()+' '+agents[i].firstname);
			
			const $ligneNom = $('<div>').append('<div class="LigneNom">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
			const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+id_agent+'"></div>');
			const $ligneTache = $('<div class="ligneTache_agent">').append('<div class="CelluleNom"></div>');
				
			let ClasseWeek = "";
			$('.jourJ').each(function(cell){
				let idCellule = $(this).prop("id");
				if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
				const $div = $('<div>')
					.addClass('Cellulejour '+ClasseWeek)
					.html("&nbsp;")
					.attr('id', agents[i].id+"_"+idCellule);
				$ligne.append($div);
				
				
				//Taches
				//Nb représente le nombre de tache simultanée sur le jour pour un agent. 
				// A terminer pour afficher plusieurs lignes de taches
				if (typeof TableauDateNb[idCellule][agents[i].id] != "undefined")					{nb = TableauDateNb[idCellule][agents[i].id].distinctCount;}
				else																				{nb = 1;}
				
				const $divTache = $('<div>')
					.addClass('CelluleTachejourAgent')
					.html("&nbsp;")
					.attr('id', 'Taches_'+agents[i].id+"_"+idCellule);
				$ligneTache.append($divTache);
				
				});
			$body.append($ligne);
			$body.append($ligneTache);
			$partie_tableau_gauche.append($ligneNom);
			}
		}
	
	remplissage_agent();
	}
function chargerDonnees() {
	let mois = getParameter("mois");
	let annee = getParameter("annee");
	if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
	if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
	
	let path = annee+"_"+mois;
		
	return $.getJSON(pathJson+path+".json")
		.done(function(donnees) {
			informations = donnees.informations || [];
			agents = donnees.agents || [];
			calendrier = donnees.calendrier || [];
			taches = donnees.taches || [];
			taches_agents = donnees.taches_agents || [];
			
			if(informations.length > 0) {
				var derniereModif = informations[0].derniere_modification;
				$('#derniere_modif').html("Dernière modification le "+formatDateLisible(derniereModif));				
				}
				
			$('#tips').show();
			})
		.fail(function(jqxhr, textStatus, error) {
			$('#partie_tableau_gauche').hide();
			
			if (typeof getParameter("choixSel") === "undefined" || getParameter("choixSel") == "" || getParameter("choixSel") == "service"){
				var texte = "Le tableau de service du mois de <span>"+Trad_Mois[mois-1]+" "+annee+"</span> n'a pas encore été crée";
				}
			else if (getParameter("choixSel") == "pole"){
				let poleSelect = $('.selectionPole option:selected').text();
				var texte = "Le tableau du pôle <span>"+poleSelect+"</span> du mois de <span"+Trad_Mois[mois-1]+" "+annee+"</span> n'a pas encore été crée";
				}
			else if (getParameter("choixSel") == "subdivision"){
				let subdivisionSelect = $('.selectionSubdivision option:selected').text();
				var texte = "Le tableau de la subdivision <span>"+subdivisionSelect+"</span> du mois de <span>"+Trad_Mois[mois-1]+" "+annee+"</span> n'a pas encore été crée";
				}
			$('#tips').hide();
			$('#erreur').html("<i class='bi bi-exclamation-triangle-fill'></i><br><br>"+texte);
			console.error("❌ Erreur de chargement JSON :", textStatus, error);
			});
	}	
function filtrage_Service(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	
	for (var i=0;i<parseInt(agents.length);i++){
		const $ligneNom = $('<div>').append('<div class="LigneNomService" id="ligne_'+agents[i].id+'">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
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
			const $ligneNom = $('<div>').append('<div class="LigneNom" id="ligne_'+agents[i].id+'">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
			const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
			const $ligneTache = $('<div class="ligneTache_agent">').append('<div class="CelluleNom"></div>');
				
			let ClasseWeek = "";
			$('.jourJ').each(function(cell){
				let idCellule = $(this).prop("id");
				if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
				const $div = $('<div>')
					.addClass('Cellulejour '+ClasseWeek)
					.html("&nbsp;")
					.attr('id', agents[i].id+"_"+idCellule);
				$ligne.append($div);
				
				
				const $divTache = $('<div>')
					.addClass('CelluleTachejour')
					.html("&nbsp;")
					.attr('id', 'Taches_'+agents[i].id+"_"+idCellule);
				$ligneTache.append($divTache);
				});
			$body.append($ligne);
			$body.append($ligneTache);
			$partie_tableau_gauche.append($ligneNom);
			}
		}
	remplissage();
	}
function filtrage_Subdivision(){
	const $body = $('#contenuTableau').empty();
	const $partie_tableau_gauche = $('#partie_tableau_gauche').empty();
	var TableauDateNb = [];
	$('.jourJ').each(function(cell){
		let idCellule = $(this).prop("id");
		var stats = getSimultaneousTasksPerAgent(idCellule);
		TableauDateNb[idCellule] = getSimultaneousTasksPerAgent(idCellule);
		});		
					
	let id_sub = getParameter("id_subdivision");
	if ($.isNumeric(id_sub)){
		for (var i=0;i<parseInt(agents.length);i++){
			var idSub = parseInt(agents[i].id_subdivision);
			
			if (idSub == id_sub){	
				const $ligneNom = $('<div>').append('<div class="LigneNom" id="ligne_'+agents[i].id+'">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
				const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
				const $ligneTache = $('<div class="ligneTache_agent">').append('<div class="CelluleNom"></div>');
					
				let ClasseWeek = "";
				$('.jourJ').each(function(cell){
					let idCellule = $(this).prop("id");
					
					// Celulle
					if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
					const $div = $('<div>')
						.addClass('Cellulejour '+ClasseWeek)
						.html("&nbsp;")
						.attr('id', agents[i].id+"_"+idCellule);
					$ligne.append($div);

					//Taches
					//Nb représente le nombre de tache simultanée sur le jour pour un agent. 
					// A terminer pour afficher plusieurs lignes de taches
					if (typeof TableauDateNb[idCellule][agents[i].id] != "undefined")					{nb = TableauDateNb[idCellule][agents[i].id].distinctCount;}
					else																				{nb = 1;}
					
					const $divTache = $('<div>')
						.addClass('CelluleTachejour')
						.html("&nbsp;")
						.attr('id', 'Taches_'+agents[i].id+"_"+idCellule);
					$ligneTache.append($divTache);
					});
				$body.append($ligne);
				$body.append($ligneTache);
				$partie_tableau_gauche.append($ligneNom);
				}
			}
		}
	else{
		let tableauIdEncadrement = id_sub.split('*').filter(Boolean).map(Number); 
		for (var i=0;i<agents.length;i++){
			var idSub = parseInt(agents[i].id_subdivision);
			if ($.inArray(idSub, tableauIdEncadrement) !== -1) {
				const $ligneNom = $('<div>').append('<div class="LigneNom" id="ligne_'+agents[i].id+'">'+agents[i].lastname+'.'+agents[i].firstname.substr(0, 1)+'</div>');
				const $ligne = $('<div class="ligne_agent">').append('<div class="CelluleNom" id="'+agents[i].id+'"></div>');
				const $ligneTache = $('<div class="ligneTache_agent">').append('<div class="CelluleNom"></div>');
				let ClasseWeek = "";
				$('.jourJ').each(function(cell){
					let idCellule = $(this).prop("id");
					if ($(this).hasClass("week-end"))		ClasseWeek = "week-end";		else 			ClasseWeek = "";
					const $div = $('<div>')
						.addClass('Cellulejour '+ClasseWeek)
						.html("&nbsp;")
						.attr('id', agents[i].id+"_"+idCellule);
					const $divTache = $('<div>')
						.addClass('CelluleTachejour')
						.html("&nbsp;")
						.attr('id', 'Taches_'+agents[i].id+"_"+idCellule);
					$ligne.append($div);
					$ligneTache.append($divTache);
					});
				$body.append($ligne);
				$body.append($ligneTache);
				$partie_tableau_gauche.append($ligneNom);
				}
			}
		}
	remplissage();
	}
function remplissage(){
	$('.LigneNom').click(function() {
		let id = $(this).prop('id');
		id = id.replace('ligne_','');
		
		let mois = getParameter("mois");
		let annee = getParameter("annee");
		if (typeof mois === "undefined")		{mois  = (new Date).getMonth()+1;}
		if (typeof annee === "undefined")		{annee  = (new Date).getFullYear();}
		window.location.replace("agent.html?mois="+mois+"&annee="+annee+"&id_agent="+id);
		});
	let unitaire = parseInt($('.Cellulejour').css("width"));
	let hauteurTache = $('.CelluleTachejour').css("height");
	
					
	$('.CelluleNom').each(function(cell){
		let idAgent = $(this).prop("id");	
		let hauteur = $('#ligne_'+idAgent).css("height");	
		
		for (var j=0;j<calendrier.length;j++){
			if (calendrier[j].id_agent ==  idAgent){
				let Ladate = calendrier[j].debut;
				let jour = calendrier[j].jour;
				let duree = calendrier[j].duree;
				let coloriage = calendrier[j].coloriage;
				let largeurDiv = parseInt(calendrier[j].duree)*unitaire;
				
				
				let Tab = getTacheByDateAgent(Ladate, idAgent);
				for (var n=0;n<Tab.length;n++){
					let background = getBackgroundColorByIdTache(Tab[n].id_tache);
					let color = getColorByIdTache(Tab[n].id_tache);
					let largeurDivTache = parseInt(Tab[n].duree)*unitaire-2;
					
					if (Tab[n].duree > 1){
						let jusqua = ajouterJours(Ladate, parseInt(Tab[n].duree));
						var dateDebut = ajouterJours(Ladate,1);
						var Deb = new Date(dateDebut);
						var dateFin = new Date(jusqua);
						
						for (var date = Deb; date < dateFin; date = ajouterUnJour(new Date(date))) {
							let DateHide = date.toISOString().split('T')[0];
							DateHide = idAgent+"_"+DateHide;
							$('#Taches_'+DateHide).hide();
							largeurDivTache = largeurDivTache+1;
							}
						}

					const $cellule = $('#Taches_'+idAgent+'_'+Ladate).empty();
					const $div = $('<div>')
					  .addClass('divTache')
					  .css('width',largeurDivTache+"px")
					  .css('background-color','#'+background)
					  .css('color','#'+color)
					  .html(Tab[n].tache_courte);
					$cellule.append($div);
					}
				
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
function remplissage_agent(){
	$('#partie_tableau_droite').css("margin-left","0px");
	$('.Cellulejour').css("line-height","60px");
	
	let unitaire = getDisplayedWidth('.jourNum');
	let hauteurTache = $('.CelluleTachejourAgent').css("height");
	let id_agent = getParameter("id_agent");
	let hauteur = $('#ligne_'+id_agent).css("height");	
		
	for (var j=0;j<calendrier.length;j++){
		if (calendrier[j].id_agent ==  id_agent){
			let Ladate = calendrier[j].debut;
			let jour = calendrier[j].jour;
			let duree = calendrier[j].duree;
			let coloriage = calendrier[j].coloriage;
			let largeurDiv = parseInt(calendrier[j].duree)*unitaire-2;
			let Tab = getTacheByDateAgent(Ladate, id_agent);
				
			for (var n=0;n<Tab.length;n++){
				let background = getBackgroundColorByIdTache(Tab[n].id_tache);
				let color = getColorByIdTache(Tab[n].id_tache);
				let largeurDivTache = parseInt(Tab[n].duree)*unitaire-2;		
				if (Tab[n].duree > 1){
					let jusqua = ajouterJours(Ladate, parseInt(Tab[n].duree));
					var dateDebut = ajouterJours(Ladate,1);
					var Deb = new Date(dateDebut);
					var dateFin = new Date(jusqua);
					
					for (var date = Deb; date < dateFin; date = ajouterUnJour(new Date(date))) {
						let DateHide = date.toISOString().split('T')[0];
						DateHide = id_agent+"_"+DateHide;
						$('#Taches_'+DateHide).hide();
						largeurDivTache = largeurDivTache+1;
						}
					}
				const $cellule = $('#Taches_'+id_agent+'_'+Ladate).empty();
				const $div = $('<div>')
				  .addClass('divTache')
				  .css('width',largeurDivTache+"px")
				  .css('background-color','#'+background)
				  .css('color','#'+color)
				  .html(Tab[n].tache_courte);
				$cellule.append($div);
				
				}
				
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
					
					DateHide = id_agent+"_"+DateHide;
					$('#'+DateHide).hide();
					largeurDiv = largeurDiv+1;
					}
				}
			const $cellule = $('#'+id_agent+'_'+Ladate).empty();
			const $div = $('<div>')
			  .addClass('div')
			  .css('width',largeurDiv+"px")
			  .css('background-color','#'+calendrier[j].background)
			  .css('color','#'+calendrier[j].color)
			  .html(affichage);
			// console.log("Ajout de "+affichage+" le "+Ladate+" sur une duree de "+duree);
			$cellule.append($div);
			}
		}
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
		$('#divBas').html("Votre session se fermera dans "+deltaResant+" secondes. <a href='javascript:void(0);' onclick='maintenir_connexion();'>Rester connecté</a>");
		}
	else{
		$('#divBas').hide();
		}
	calculTempSession();
	}
function calculTempSession(){
	let timer = setTimeout("tempsSession();",1000);
	}
function getDisplayedWidth(selectorOrElem) {
	var $el = (selectorOrElem.jquery ? selectorOrElem : $(selectorOrElem));
	if ($el.length === 0) return 0;
	var el = $el.get(0);

	// s'assurer que le navigateur a fini le layout
	// (utile si on appelle juste après changement CSS)
	// on utilise requestAnimationFrame pour laisser le navigateur rendre
	return el.getBoundingClientRect().width;
	}
function in_array(needle, haystack) {
	return $.inArray(needle, haystack) !== -1;
	}
function getTachesByAgent(data, id_agent) {
	return data
	.filter(item => item.id_agent === id_agent) // on garde seulement les entrées correspondant à l’agent
	.map(item => item.id_tache);                // on ne garde que l’id_tache
	}
function getTacheByDateAgent(date, id_agent) {
    var result = [];

    if (!taches || !taches_agents) return result;

    // 1. Récupérer toutes les id_tache liées à cet agent
    var tachesAgent = [];
    $.each(taches_agents, function(i, item) {
        if (item.id_agent == id_agent && $.inArray(item.id_tache, tachesAgent) === -1) {
            tachesAgent.push(item.id_tache);
        }
    });

    // 2. Filtrer les tâches par date et id_tache
    $.each(taches, function(i, tache) {
        if (tache.debut === date && $.inArray(tache.id_tache, tachesAgent) !== -1) {
            // vérifier si l'objet existe déjà pour éviter les doublons
            var exists = result.some(function(r) {
                return r.id_tache == tache.id_tache && r.tache_courte == tache.tache_courte;
            });
            if (!exists) {
                result.push({
                    id_tache: tache.id_tache,
                    tache_courte: tache.tache_courte,
                    duree: tache.duree
                });
            }
        }
    });

    return result;
}
function getColorByIdTache(id_tache) {
    if (!taches) return null; // sécurité si taches n'est pas défini

    var couleur = null;

    $.each(taches, function(i, tache) {
        if (tache.id_tache == id_tache) {
            couleur = tache.color;
            return false; // stoppe la boucle dès qu'on a trouvé
        }
    });

    return couleur;
}
function getBackgroundColorByIdTache(id_tache) {
    if (!taches) return null; // sécurité si taches n'est pas défini

    var couleur = null;

    $.each(taches, function(i, tache) {
        if (tache.id_tache == id_tache) {
            couleur = tache.background;
            return false; // stoppe la boucle dès qu'on a trouvé
        }
    });

    return couleur;
}
function getSimultaneousTasksPerAgent(date) {
  if (!taches || !taches_agents) return {};

  // helper: parse YYYY-MM-DD to Date at UTC midnight
  function parseYMD(ymd) {
    var p = (ymd || '').split('-');
    if (p.length !== 3) return null;
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }
  function addDaysUTC(d, days) {
    var nd = new Date(d.getTime());
    nd.setUTCDate(nd.getUTCDate() + days);
    return nd;
  }

  var target = parseYMD(date);
  if (!target) return {};

  // 1) Construire un mapping id_tache -> liste des id_agent associés (pour accès rapide)
  var agentsByTache = {}; // { id_tache: { agentId: true, ... }, ... }
  $.each(taches_agents, function(i, ta) {
    if (!ta || ta.id_tache == null) return;
    var idt = String(ta.id_tache);
    var ida = String(ta.id_agent);
    if (!agentsByTache[idt]) agentsByTache[idt] = {};
    agentsByTache[idt][ida] = true;
  });

  // 2) Pour chaque tache dans taches, si elle couvre la date, incrémenter pour tous les agents concernés
  var result = {}; // { agentId: { totalOccurrences: n, distinctCount: m, details: [...] } }

  $.each(taches, function(i, t) {
    if (!t || t.id_tache == null) return;
    var idt = String(t.id_tache);
    var dDeb = parseYMD(t.debut);
    var duree = parseInt(t.duree, 10) || 1;
    if (!dDeb) return;
    var dEnd = addDaysUTC(dDeb, duree - 1);

    // si la date cible est dans l'intervalle [dDeb, dEnd]
    if (target.getTime() < dDeb.getTime() || target.getTime() > dEnd.getTime()) return;

    // obtenir la liste des agents affectés pour cette id_tache
    var agentList = agentsByTache[idt];
    if (!agentList) return; // pas d'agent pour cette tache

    // pour chaque agent lié à cette id_tache, incrémenter
    for (var agentId in agentList) if (agentList.hasOwnProperty(agentId)) {
      if (!result[agentId]) {
        result[agentId] = {
          totalOccurrences: 0,
          // map intern de id_tache -> occurrences
          _map: {},
          details: []
        };
      }

      // occurrences totales (compte chaque enregistrement t dans taches)
      result[agentId].totalOccurrences++;

      // incrémenter map pour id_tache
      if (!result[agentId]._map[idt]) result[agentId]._map[idt] = { occurrences: 0, tache_courte: t.tache_courte || null, color: t.color || null, background: t.background || null, duree: t.duree || null };
      result[agentId]._map[idt].occurrences++;
    }
  });

  // 3) convertir map en details + distinctCount, et nettoyer clé interne
  for (var aid in result) if (result.hasOwnProperty(aid)) {
    var obj = result[aid];
    var detailsArr = [];
    for (var idt2 in obj._map) if (obj._map.hasOwnProperty(idt2)) {
      var it = obj._map[idt2];
      detailsArr.push({
        id_tache: idt2,
        tache_courte: it.tache_courte,
        color: it.color,
        background: it.background,
        duree: it.duree,
        occurrences: it.occurrences
      });
    }
    obj.details = detailsArr;
    obj.distinctCount = detailsArr.length;
    delete obj._map;
  }

  return result;
}
function maintenir_connexion(){
	sessionStorage.setItem("dC",Date.now());
	}
async function enterFullscreen(elem) {
	if (elem.requestFullscreen) return elem.requestFullscreen();
	if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen(); // Safari
	if (elem.msRequestFullscreen) return elem.msRequestFullscreen(); // old IE / Edge
	return Promise.reject(new Error('Fullscreen API non disponible'));
	}
function isFullscreen() {
	return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
	}
function getCurrentOrientationKind() {
	// retourne 'portrait' ou 'landscape' si détectable, sinon null
	try {
		const type = screen.orientation && screen.orientation.type;
		if (typeof type === 'string') {
			return type.includes('portrait') ? 'portrait' : (type.includes('landscape') ? 'landscape' : null);
			}
		// fallback : utiliser angle si dispo
		if (screen.orientation && typeof screen.orientation.angle === 'number') {
			const ang = screen.orientation.angle;
			return (ang === 0 || ang === 180) ? 'portrait' : 'landscape';
			}
	// dernier fallback : comparer innerWidth/innerHeight
		return (window.innerHeight >= window.innerWidth) ? 'portrait' : 'landscape';
			} catch (e) {
			return null;
			}
	}
async function lockOrientation(kind) {
	if (screen.orientation && screen.orientation.lock) {
		// preferer landscape-primary / portrait-primary si nécessaire
		const param = (kind === 'landscape') ? 'landscape' : 'portrait';
		return screen.orientation.lock(param); // renvoie une promise
		}
	return Promise.reject(new Error('screen.orientation.lock non supporté'));
	}
function onFullScreenChange() {
	// propre nettoyage : quand on sort du plein écran, on retire les classes fallback

	if (!isFullscreen()) {
		$('body').removeClass('force-portrait force-landscape');
		// on peut aussi tenter de unlock si API dispo
		if (screen.orientation && screen.orientation.unlock) {
			try { screen.orientation.unlock(); } catch(_) {}
			}
		}
	}
function formatDateLisible(dateStr) {
    if (!dateStr) return "";

    var mois = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

    var parts = dateStr.split(" "); // ["2025-11-11", "17:58:48"]
    var dateParts = parts[0].split("-"); // ["2025", "11", "11"]
    var timeParts = parts[1].split(":"); // ["17", "58", "48"]

    var annee = dateParts[0];
    var moisIndex = parseInt(dateParts[1], 10) - 1; // attention, 0-indexé
    var jour = parseInt(dateParts[2], 10);

    var heures = timeParts[0];
    var minutes = timeParts[1];

    return jour + " " + mois[moisIndex] + " " + annee + " à " + heures + "h" + minutes;
}

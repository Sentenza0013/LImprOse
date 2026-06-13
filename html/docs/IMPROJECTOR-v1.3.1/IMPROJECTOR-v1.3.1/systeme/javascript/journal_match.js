

function journalMatchPrepa() {// met à jour les infos qui précèdent l'écriture du journal (titre du journal, etc.)
	
	CP.getElementById('journal_nom_equipeG').innerHTML=equipegauche.nom;
	CP.getElementById('journal_nom_equipeD').innerHTML=equipedroite.nom;
	
}

function journalMatchImproWrite(){// Fonction qui met à jour le journal dans le panneau de contrôle
	
	if (design.cptchaussonsActif=="oui") {var comptechaussons = '<br><br>'+design.cptchaussonsTxtAvant+design.cptchaussons+design.cptchaussonsTxtApres;}//on détermine si le compteur de chaussons est actif pour savoir si on ajoute l'info
	else {var comptechaussons = "";}
	
	CP.getElementById('journal_match').innerHTML = journalMatch+comptechaussons;
	
}

function effacerJournalMatch(){
	
	var sur = confirm("Êtes-vous sûr de vouloir effacer le journal du match ?");
	if (sur) {
    journalMatch ="";
	journalMatchImproWrite();
	}

	
}

//---------------NOUVELLE IMPRO---------------------

function journalMatchImpro() {//À chaque nouvelle impro, on va ajouter une ligne au journal avec les infos de l'impro
	
	var improActuelle = impro.type+impro.titre+impro.categorie+impro.duree; //d'abord on met dans une variable tampon les données de l'impro qui vient d'être validée.
	
	if (improActuelle==journalMatchImproPrec) {return;}//on la compare avec l'impro précédente. Si c'est la même chose, on sort
	//cela évite les répétitions dans le journal en cas de validations successives de la même impro (pour les comparées par exemple)
	if (impro.titre=="Titre de l'improvisation en cours") {return;}//pour éviter que la fonction testImpro ne soint inscrite dans le journal
	
	else {// si ce n'est pas la même impro :
	
	//d'abord on rajoute de nouvelles lignes au journal existant avec l'impro qui vient d'être lancée :
	journalMatch = journalMatch + 
	"<br><br><i>" + afficheur.getElementById('af_timer_periode').innerHTML + "</i>" +
	"<br>&nbsp;&nbsp;►&nbsp;Improvisation <b>" + impro.type + "</b> dont le titre est : <b>" + impro.titre + "</b> - Catégorie : <b>" + impro.categorie + "</b> - Durée : <b>" + impro.duree + "</b>.";
	
	journalMatchImproWrite();//puis on met à jour le journal dans le Panneau de contrôle
	
	journalMatchImproPrec = impro.type+impro.titre+impro.categorie+impro.duree;//et enfin on met à jour la variable qui servira à la prochaine comparaison
	}
	
}


//---------------PERTES ET GAINS DE POINTS---------------------



function JournalMatchEquipeGIncr() {//equipe gauche marque un point
	journalMatch = journalMatch + 
	"<br><br>- Un point marqué par <strong>" + equipegauche.nom + "</strong>.";
	journalMatchScore();//on fait suivre par le nouveau score
}

function JournalMatchEquipeDIncr() {//equipe droire marque un point
	journalMatch = journalMatch + 
	"<br><br>- Un point marqué par <strong>" + equipedroite.nom + "</strong>.";
	journalMatchScore();//on fait suivre par le nouveau score
}

function JournalMatchEquipeGDecr() {//equipe gauche marque un point
	journalMatch = journalMatch + 
	"<br><br>Un point en moins pour " + equipegauche.nom + ".";
	journalMatchScore();//on fait suivre par le nouveau score
}	
	
	function JournalMatchEquipeDDecr() {//equipe droire marque un point
	journalMatch = journalMatch + 
	"<br><br>Un point en moins pour " + equipedroite.nom + ".";
	journalMatchScore();//on fait suivre par le nouveau score
}


function journalMatchScore() {//À chaque mise à jour du score, on ajoute l'info

	journalMatch = journalMatch + 
	"<br>&nbsp;&nbsp;•&nbsp;<span style='text-decoration: underline;'>Score :</span> " + equipegauche.nom + " [ <b>" + equipegauche.score + "</b> ] / " + equipedroite.nom + " [ <b>" + equipedroite.score + "</b> ]<br>";
	
	journalMatchImproWrite();//puis on met à jourle journal dans le Panneau de contrôle
}


//-------------PENALITÉS---------------------------------


	function JournalMatchEquipeD1Peno() {//équipe droite a une première pénalité
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;° " + equipedroite.nom + " : une pénalité.";
	journalMatchImproWrite();
	}


	function JournalMatchEquipeD2Peno() {//équipe droite a une 2e pénalité
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;°° " + equipedroite.nom + " : deuxième pénalité !";
	journalMatchImproWrite();
	}
	
	function JournalMatchEquipeD3PenoConvert() {//équipe droite a une 3e pénalité
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;°°° " + equipedroite.nom + " : Aïe, troisième pénalité !!! Un point supplémentaire sera donc accordé à l'équipe adverse.";
	journalMatchImproWrite();
	}
	
	
	
	function JournalMatchEquipeG1Peno() {//équipe gauche a une première pénalité
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;° " + equipegauche.nom + " : une pénalité.";
	journalMatchImproWrite();
	}


	function JournalMatchEquipeG2Peno() {//etc.
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;°° " + equipegauche.nom + " : deuxième pénalité !";
	journalMatchImproWrite();
	}
	
	function JournalMatchEquipeG3PenoConvert() {//etc.
	journalMatch = journalMatch + 
	"<br><br>&nbsp;&nbsp;&nbsp;&nbsp;°°° " + equipegauche.nom + " : Ouch, troisième pénalité !!! Un point supplémentaire sera donc accordé à l'équipe adverse.";
	journalMatchImproWrite();
	}
	

//-------------SAUVEGARDE JOURNAL---------------------------------	

function JournalMatchExport(){
	
	if (navigator.userAgent.indexOf('Edge') >= 0){alert('Votre navigateur est incompatible avec cette fonctionnalité...');return;}
	
	if (design.cptchaussonsActif=="oui") {var comptechaussons = '<br><br>'+design.cptchaussonsTxtAvant+design.cptchaussons+design.cptchaussonsTxtApres;}//on détermine si le compteur de chaussons est actif pour savoir si on ajoute l'info
	else {var comptechaussons = "";}
	
	var nomfichier="Journal_du_match_"+equipegauche.nom+"_vs_"+equipedroite.nom+".html";
	var contenufichier='<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Journal du match entre '+equipegauche.nom+' et '+equipedroite.nom+'</title></head><style>body {font-family: georgia; background-color: rgb(218, 215, 200);}</style><body><br><br><div style="text-align: center;"><h2>Journal du match entre<br>'+equipegauche.nom+' et '+equipedroite.nom+'</h2><br>---------------------</div><br><br><br>'+journalMatch+comptechaussons+'</body></html>';
		
	contenufichier=contenufichier.replace(/[#~]/g,'_');//nettoyage de quelques carractères spéciaux potentiellement problématiques
	
	var blob = new Blob(["\ufeff", contenufichier], {type: 'text/html'});
	var url = URL.createObjectURL(blob);
	
	var a = document.body.appendChild(
        document.createElement("a")
    );
	
	a.download = nomfichier;
	a.href = url;
	//a.href = "data:text/html," + contenufichier;
    //a.href = "data:text/html," + contenufichier;
	//a.href = "data:text/csv;base64,"+btoa(data);
	//a.href = "data:text/csv;charset=ANSI;base64,"+btoa(data);//
	a.click();
	
	flashSave();
}



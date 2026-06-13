	// -------------- Gestion de la mémorisation et de l'affichage logos en base64 --------------------------------------------------------------------------				
	
	function loadLogoGauche()
{
    var logogauche = CP.getElementById("logo_equipe_gauche").files;
    if (logogauche.length > 0)
    {
        var fileToLoad = logogauche[0];
 
        var fileReader = new FileReader();
 
        fileReader.onload = function(fileLoadedEvent)
        {
                
            equipegauche.logoUrl = fileLoadedEvent.target.result;
         
            afficheur.getElementById('af_logo_gauche').src = equipegauche.logoUrl;
			CP.getElementById('CPlogoEquipeG_RM').src=equipegauche.logoUrl;
			CP.getElementById('CPlogoEquipeG').src=equipegauche.logoUrl;
         
        };
 
        fileReader.readAsDataURL(fileToLoad);
    }

	flashSave();
	}

	function loadLogoDroite()
{
    var logodroite = CP.getElementById("logo_equipe_droite").files;
    if (logodroite.length > 0)
    {
        var fileToLoad = logodroite[0];
 
        var fileReader = new FileReader();
 
        fileReader.onload = function(fileLoadedEvent)
        {
               
            equipedroite.logoUrl = fileLoadedEvent.target.result;
         
            afficheur.getElementById('af_logo_droite').src = equipedroite.logoUrl;
			CP.getElementById('CPlogoEquipeD_RM').src=equipedroite.logoUrl;
			CP.getElementById('CPlogoEquipeD').src=equipedroite.logoUrl;
        };
 
        fileReader.readAsDataURL(fileToLoad);
    }

	flashSave();
	}

function killLogoGauche(){
		CP.getElementById('logo_equipe_gauche').value='';
		equipegauche.logoUrl='';
		afficheur.getElementById('af_logo_gauche').src = '';
		CP.getElementById('CPlogoEquipeG').src=equipegauche.logoUrl;
		CP.getElementById('CPlogoEquipeG_RM').src=equipegauche.logoUrl;
		flashSave();
		
		}

function killLogoDroite(){
		CP.getElementById('logo_equipe_droite').value='';
		equipedroite.logoUrl='';
		afficheur.getElementById('af_logo_droite').src = '';
		CP.getElementById('CPlogoEquipeD').src=equipedroite.logoUrl;	
		CP.getElementById('CPlogoEquipeD_RM').src=equipedroite.logoUrl;
		flashSave();
		
		}
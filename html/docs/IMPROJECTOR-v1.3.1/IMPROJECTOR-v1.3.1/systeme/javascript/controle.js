
//----------------------------------------------------fonctions communes aux deux modules-------------------------

	
//blocage touche F5	



var version = navigator.appVersion;

function disableF5(e) 
{   var keycode = (window.event) ? event.keyCode : e.keyCode;

    if ((version.indexOf('MSIE') != -1)) 
    {  if (keycode == 116) 
       {  event.keyCode = 0;
          event.returnValue = false;
          return false;
		  }
		  
	}
    else 
    {  if (keycode == 116) 
		{alert('Ne pas actualiser la page du panneau de contrôle (en pressant F5 ou autre) : vous ne pourrez plus contrôler le tableau d\'affichage !');
		return false;}
	}
	
}
	


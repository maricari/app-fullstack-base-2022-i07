class Framework{
    public ejecutarRequest(metodo:string, url:string, accion?: HandlerResponse, data?:any) {
        /*
        metodo: GET, POST, PUT, DELETE
        */
        console.log(`Request (${url})`)
        
        let req = new XMLHttpRequest();
        req.onreadystatechange = ()=>{
            if (req.readyState == 4) {
                if(req.status == 200) {
                    if (url.endsWith('/devices')) {
                        accion.cargarGrilla(req.responseText)
                    } 
                    }
                else {
                    console.log("error en la consulta")
                    }
                }
            }
        req.open(metodo, url, true);
        if (data!= undefined) {
            req.setRequestHeader("Content-Type", "application/json")
            req.send(data);    
            }
        else {
            req.send(); 
            }
        }

    public showLoad() {
        let loading = <HTMLInputElement> document.getElementById("loading");
        loading.hidden = false
    }
    public hideLoad() {
        let loading = <HTMLInputElement> document.getElementById("loading");
        loading.hidden = true
    }


}

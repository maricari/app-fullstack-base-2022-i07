class Framework{
    public ejecutarRequest(metodo:string, url:string, operacion: string, accion?: HandlerResponse, data?:any) {
        /*
        metodo: GET, POST, PUT, DELETE

        operacion
        'R' : 'consulta_dispositivos'
        */

        let req = new XMLHttpRequest();
        req.onreadystatechange = ()=>{
            if (req.readyState == 4) {
                if(req.status == 200) {
                    switch ( operacion ) {
                        case 'R': // read
                            accion.cargarGrilla(req.responseText)
                            break;
                        default: 
                            // 
                            break;
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

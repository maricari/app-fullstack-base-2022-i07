declare const M;

class Main implements EventListenerObject, HandlerResponse{

    private f:Framework = new Framework();

    handleEvent(e:Event): void {
        console.log()
        let el:HTMLElement;
        el = <HTMLElement> e.target

        // Alta nuevo dispositivo
        if (el.id == 'confirmar_alta') {
            let nombre = (<HTMLInputElement>document.getElementById("disp_nombre")).value;
            let tipo = (<HTMLInputElement>document.getElementById("disp_tipo")).value;
            let tipo_estado = (<HTMLInputElement>document.getElementById("disp_tipo_estado")).value;
            let descripcion = (<HTMLInputElement>document.getElementById("disp_desc")).value;
            this.crearDispositivo(nombre, tipo, tipo_estado, descripcion);
            this.consultarDispositivos();
        }

        // Modifica status de un dispositivo
        if (el.id.startsWith('cb_')) {
            let id_disp = el.id.substring(3)

            let btn = <HTMLInputElement>el
            if (btn.type == "checkbox") {
                this.cambiarEstadoDispositivo(id_disp, btn.type, btn.checked);
                }
            else {
                this.cambiarEstadoDispositivo(id_disp, btn.type,(+btn.value >0) , +btn.value);
            }
        }

        // Borra un dispositivo
        if (el.id.startsWith('D_')) {
            let id_disp = el.id.substring(2)
            this.borrarDispositivo(id_disp);
            this.consultarDispositivos();

        }

    }
    
    constructor() {        
    }

    // CONSULTA DISPOSITIVOS -------------------------------------------------------
    consultarDispositivos() {
        this.f.showLoad();        
        this.f.ejecutarRequest("GET", "http://localhost:8000/devices", this)
        this.f.hideLoad();
    }

    cargarGrilla(dispositivosString:string) {
        let arrDevices: Array<Device>
        arrDevices = JSON.parse(dispositivosString)
        let caja = document.getElementById("cajaDispositivos");

        let grilla: string = `<ul class="collection">`

        for (let disp of arrDevices) {

            // seteo la imagen del dispositivo
            let imagen: string;
            imagen = disp.type + ".jpg"

            // seteo el status del dispositivo
            let checked: string;
            if (disp.state) {
                checked = 'checked'
            }
            else {
                checked = ''
            }

            // estado On/Off o Slicer
            let disp_estado: string;
            if (disp.state_type == 2 ) { // Intensidad
                disp_estado = `
                <a href="#!" class="secondary-content">
                <form action="#">
                <p class="range-field">
                  <input type="range" id="cb_${disp.id}" value = ${disp.intensidad} min="0" max="100" />
                </p>
                </form>
                </a>`

                } else { //  On/Off
                disp_estado = `
                <a href="#!" class="secondary-content">
                <div class="switch">
                <label>
                Off
                <input id="cb_${disp.id}" type="checkbox" ${checked}>
                <span class="lever"></span>
                On
                </label>
                </div>
                </a>`
            }

            // armo la fila de la grilla con los datos del dispositivo
            grilla +=`
            <li class="collection-item avatar">
            <img src="static/images/${imagen}" alt="" class="circle">
            <span contenteditable="false" class="title nombre_disp" id="name_${disp.id}">${disp.name}</span>
            <p contenteditable="false" id="desc_${disp.id}">${disp.description} <br>
            </p>
            ${disp_estado}
            <a class="waves-effect waves-light btn-small materialize-red" id="D_${disp.id}" >Borrar</a>                    
            </li>
            `
            }
        grilla +=`</ul>`
        caja.innerHTML = grilla

        // armo los listeners para los botones
        for (let disp of arrDevices) {
            // update status
            let btn = document.getElementById(`cb_${disp.id}`)
            btn.addEventListener("click", this);

            // borrar dispositivo
            let btn2 = document.getElementById(`D_${disp.id}`)
            btn2.addEventListener("click", this);

            }     
        } // end cargarGrilla


    vaciarForm() {
 
        let nombre = <HTMLInputElement>document.getElementById("disp_nombre");
        let descripcion = <HTMLInputElement>document.getElementById("disp_desc");
        let tipo = <HTMLInputElement>document.getElementById("disp_tipo");
        let tipo_estado = <HTMLInputElement>document.getElementById("disp_tipo_estado");

        nombre.value = "";
        descripcion.value = "";
        tipo.value = "";
        tipo_estado.value = "";        

    }

    // ALTA DISPOSITIVOS -----------------------------------------------------------

    crearDispositivo(nombre, tipo, tipo_estado, descripcion) {

        let data = JSON.stringify({type: tipo, name:nombre, description:descripcion, state_type:tipo_estado})
        this.f.ejecutarRequest("POST", "http://localhost:8000/devicesNew", this, data)
        this.confirmarAccion("El dispositivo fue agregado correctamente a la base de datos.")

        let form = <HTMLDivElement>document.getElementById("modalForm")
        var instance = M.Modal.getInstance(form);
        instance.close();
        this.vaciarForm();

        }

    // MODIFICACION DISPOSITIVOS ---------------------------------------------------

    cambiarEstadoDispositivo(id, tipo, estado, intensidad = 0) {
        let data = JSON.stringify({id:id, status:estado, intensidad:intensidad})
        this.f.ejecutarRequest("PUT", "http://localhost:8000/devicesChange", this, data)
        }

    // BAJA DISPOSITIVOS -----------------------------------------------------------
  
    borrarDispositivo(id) {
        let data = JSON.stringify({id:id})
        this.f.ejecutarRequest("DELETE", "http://localhost:8000/devicesDelete", this, data)
        this.confirmarAccion("El dispositivo fue eliminado de la base de datos.")
    }


    confirmarAccion(mensaje = "Operación confirmada.") {

        let popup_mensaje = <HTMLDivElement>document.getElementById("popup_mensaje")
        popup_mensaje.innerHTML = mensaje

        let popup_confirmar = <HTMLDivElement>document.getElementById("popup_confirmar")
        var instance = M.Modal.getInstance(popup_confirmar);
        instance.open();

    }

} // fin de la clase Main


window.addEventListener("load", ()=> {
    let main:Main = new Main();
    main.consultarDispositivos();
    main.vaciarForm();

    let btn2 = document.getElementById("confirmar_alta")
    btn2.addEventListener("click", main);

    // select input
    var elems = document.querySelectorAll('select');
    let options = {}
    var instances = M.FormSelect.init(elems, options)

    // text input
    M.updateTextFields();

    var elemsm = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsm, options);

    }
)

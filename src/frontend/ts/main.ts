declare const M;

class Main implements EventListenerObject, HandlerResponse{

    private f:Framework = new Framework();

    handleEvent(e:Event): void {
        console.log()
        let el:HTMLElement;
        el = <HTMLElement> e.target
        console.log('handle event', e.type, el.id, el.textContent)

        // Alta nuevo dispositivo
        if (el.id == 'confirmar_alta') {
            let nombre = (<HTMLInputElement>document.getElementById("disp_nombre")).value;
            let tipo = (<HTMLInputElement>document.getElementById("disp_tipo")).value;
            let tipo_estado = (<HTMLInputElement>document.getElementById("disp_tipo_estado")).value;
            let descripcion = (<HTMLInputElement>document.getElementById("disp_desc")).value;
            this.crearDispositivo(nombre, tipo, tipo_estado, descripcion);
        }

        // Modifica status de un dispositivo
        if (el.id.startsWith('cb_')) {
            let id_disp = el.id.substring(3)
            let btn = <HTMLInputElement>el
            this.cambiarEstadoDispositivo(id_disp, btn.checked);
        }

        // Modifica atributos de un dispositivo
        if (el.id.startsWith('U_')) {
            let id_disp = el.id.substring(2)
            let el_name = "name_" + id_disp
            let el_desc = "desc_" + id_disp
            let nombre = (<HTMLSpanElement>document.getElementById(el_name)).firstChild.nodeValue;
            let descripcion = (<HTMLParagraphElement>document.getElementById(el_desc)).textContent;
            let m_disp_name = document.getElementById("m_disp_name");
            let m_disp_desc = document.getElementById("m_disp_desc");
            m_disp_name.innerHTML = nombre
            m_disp_desc.innerHTML = descripcion
            alert(m_disp_name + ' ' + m_disp_desc)

            // this.modificaDispositivo(id_disp, nombre, descripcion);
        }

        // Borra un dispositivo
        if (el.id.startsWith('D_')) {
            let id_disp = el.id.substring(2)
            this.borrarDispositivo(id_disp);
        }

        // console.log(e.type +' ' + e.target)
        // alert(`handling event type ${e.type} en main`)
    }
    
    constructor() {        
    }

    // CONSULTA DISPOSITIVOS -------------------------------------------------------
    consultarDispositivos() {
        this.f.showLoad();        
        this.f.ejecutarRequest("GET", "http://localhost:8000/devices", 'R', this)
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
            let status_value: number = 35;
            if (disp.type >3) { // todos On/Off (por ahora)
                disp_estado = `
                <a href="#!" class="secondary-content">
                <form action="#">
                <p class="range-field">
                  <input type="range" id="cb_${disp.id}" min="0" max="100" />
                </p>
                </form>
                </a>`

                } else {
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
            <span class="title nombre_disp" id="name_${disp.id}">${disp.name}</span>
            <p id="desc_${disp.id}">${disp.description} <br>
            </p>
            ${disp_estado}
            <a class="waves-effect waves-light btn-small materialize-red" id="D_${disp.id}" >Borrar</a>                    
            </li>
            `
            }
        grilla +=`</ul>`
        caja.innerHTML = grilla
        // <a class="waves-effect waves-light btn-small" id="U_${disp.id}" >Modificar</a>
        // <a class="waves-effect waves-light btn-small modal-trigger id="H_${disp.id}" href="#modalFormUpdate">Modificar</a>


        // armo los listeners para los botones
        for (let disp of arrDevices) {
            // update status
            let btn = document.getElementById(`cb_${disp.id}`)
            btn.addEventListener("click", this);
            console.log(btn)

            // modificar atributos
            // let btn2 = document.getElementById(`U_${disp.id}`)
            // btn2.addEventListener("click", this);

            // borrar dispositivo
            let btn3 = document.getElementById(`D_${disp.id}`)
            btn3.addEventListener("click", this);

        }     

        // provisorio, arreglar
        /*
        let slider = document.getElementById("sl_1");
        let output = document.getElementById("val_1");
        output.innerHTML = slider.value;
            
        slider.oninput = function() {
              output.innerHTML = this.value;
            }
        */
        } // end cargarGrilla

    // ALTA DISPOSITIVOS -----------------------------------------------------------
    crearDispositivo(nombre, tipo, tipo_estado, descripcion) {
        alert('alta=> ' + nombre + ' ' + tipo + ' ' + tipo_estado + ' ' + descripcion)
        // pendiente. handle tipo_estado
        let data = JSON.stringify({name:nombre, type: tipo, description:descripcion})
        this.f.ejecutarRequest("POST", "http://localhost:8000/devicesNew", 'C',  this, data)
        }


    // MODIFICACION DISPOSITIVOS ---------------------------------------------------
    cambiarEstadoDispositivo(id, estado) {
        if (estado) {
            alert(`update status: se prendio el dispositivo ${id}`)
        }
        else {
            alert(`update status: se apago el dispositivo ${id}`)
        }

        let data = JSON.stringify({id:id, status:estado})
        this.f.ejecutarRequest("PUT", "http://localhost:8000/devicesChange", 'U', this, data)
        }

    modificaDispositivo(id, nombre, descripcion) {
        alert('modifica=> ' + id + ' ' + nombre + ' ' + descripcion)
        // pendiente. handle control
        let data = JSON.stringify({id: id, name:nombre, description:descripcion})
        this.f.ejecutarRequest("PUT", "http://localhost:8000/devicesChange", 'U', this, data)
        }

    // BAJA DISPOSITIVOS -----------------------------------------------------------
  
    borrarDispositivo(id) {
        let data = JSON.stringify({id:id})
        alert(`Borrar el dispositivo ${id}`)
        this.f.ejecutarRequest("DELETE", "http://localhost:8000/devicesDelete", 'D', this, data)
    }


} // fin de la clase Main


window.addEventListener("load", ()=> {
    let main:Main = new Main();
    main.consultarDispositivos();

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

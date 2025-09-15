let contactoIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector('form');
    if (formulario) {
        configurarValidacionFormulario(formulario);
    }
    
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });
    
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const contactosExistentes = document.querySelectorAll('.contacto-item').length;
    contactoIndex = contactosExistentes;
    
    console.log('Contactos existentes:', contactosExistentes);
});

function configurarValidacionFormulario(formulario) {
    const campos = formulario.querySelectorAll('input[required], select[required]');
    campos.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validarCampo(this);
            }
        });
    });
    
    formulario.addEventListener('submit', function(e) {
        if (!validarFormularioCompleto()) {
            e.preventDefault();
            mostrarErroresValidacion();
        }
    });
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    let esValido = true;
    let mensajeError = '';
    
    if (campo.hasAttribute('required') && !valor) {
        esValido = false;
        mensajeError = 'Este campo es obligatorio';
    } else if (campo.type === 'email' && valor) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
            esValido = false;
            mensajeError = 'Formato de email inválido';
        }
    } else if (campo.name === 'legajo' && valor) {
        const regexLegajo = /^[A-Za-z0-9]+$/;
        if (!regexLegajo.test(valor)) {
            esValido = false;
            mensajeError = 'El legajo solo puede contener letras y números';
        }
    }
    
    if (esValido) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        ocultarMensajeError(campo);
    } else {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
        mostrarMensajeError(campo, mensajeError);
    }
    
    return esValido;
}

function validarFormularioCompleto() {
    const formulario = document.querySelector('form');
    const campos = formulario.querySelectorAll('input[required], select[required]');
    let esValido = true;
    
    campos.forEach(campo => {
        if (!validarCampo(campo)) {
            esValido = false;
        }
    });
    
    if (!validarContactos()) {
        esValido = false;
    }
    
    return esValido;
}

function validarContactos() {
    const contactos = document.querySelectorAll('.contacto-item');
    let esValido = true;
    
    contactos.forEach((contacto, index) => {
        const tipoSelect = contacto.querySelector('select');
        const valorInput = contacto.querySelector('input[type="text"]');
        
        const tieneTipo = tipoSelect.value !== '';
        const tieneValor = valorInput.value.trim() !== '';
        
        if (tieneTipo || tieneValor) {
            if (!tieneTipo) {
                mostrarMensajeError(tipoSelect, 'El tipo de contacto es obligatorio');
                esValido = false;
            }
            if (!tieneValor) {
                mostrarMensajeError(valorInput, 'El valor del contacto es obligatorio');
                esValido = false;
            }
            
            if (tieneTipo && tieneValor && tipoSelect.value === 'EMAIL') {
                const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!regexEmail.test(valorInput.value.trim())) {
                    mostrarMensajeError(valorInput, 'Formato de email inválido');
                    esValido = false;
                }
            }
        }
    });
    
    return esValido;
}

function mostrarMensajeError(campo, mensaje) {
    let feedback = campo.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        campo.parentNode.appendChild(feedback);
    }
    feedback.textContent = mensaje;
}

function ocultarMensajeError(campo) {
    const feedback = campo.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.remove();
    }
}

function mostrarErroresValidacion() {
    const primerError = document.querySelector('.is-invalid');
    if (primerError) {
        primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primerError.focus();
    }
    
    mostrarNotificacion('Por favor, corrige los errores en el formulario', 'warning');
}

function agregarContacto() {
    const container = document.getElementById('contactos-container');
    const nuevoContacto = document.createElement('div');
    nuevoContacto.className = 'contacto-item border rounded p-3 mb-3 fade-in';
    
    nuevoContacto.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <label class="form-label">Tipo de Contacto</label>
                <select class="form-select" name="contactos[${contactoIndex}].tipoContacto" onchange="validarCampo(this)">
                    <option value="">Seleccionar...</option>
                    <option value="EMAIL">Email</option>
                    <option value="TELEFONO">Teléfono</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label">Valor</label>
                <input type="text" class="form-control" name="contactos[${contactoIndex}].valor"
                       placeholder="Ej: juan@email.com o +54 11 1234-5678" onblur="validarCampo(this)">
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button type="button" class="btn btn-outline-danger btn-sm w-100" 
                        onclick="eliminarContacto(this)" title="Eliminar contacto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(nuevoContacto);
    contactoIndex++;
    
    setTimeout(() => {
        nuevoContacto.style.opacity = '1';
        nuevoContacto.style.transform = 'translateY(0)';
    }, 10);
    
    const tipoSelect = nuevoContacto.querySelector('select');
    tipoSelect.focus();
    
    console.log('Contacto agregado, índice:', contactoIndex - 1);
}

function eliminarContacto(boton) {
    const contacto = boton.closest('.contacto-item');
    
    contacto.style.transition = 'all 0.3s ease';
    contacto.style.opacity = '0';
    contacto.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        contacto.remove();
        console.log('Contacto eliminado');
    }, 300);
}

function confirmarDescartarCambios() {
    return confirm('¿Estás seguro de que deseas descartar los cambios realizados?');
}

function guardarCambios() {
    const formulario = document.querySelector('form');
    if (formulario && validarFormularioCompleto()) {
        const btnGuardar = formulario.querySelector('button[type="submit"]');
        const textoOriginal = btnGuardar.innerHTML;
        
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Guardando...';
        btnGuardar.disabled = true;
        
        formulario.submit();
    } else {
        mostrarErroresValidacion();
    }
}

document.addEventListener('keydown', function(e) {
    // Ctrl + S para guardar
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        guardarCambios();
    }
    
    // Ctrl + N para nuevo contacto
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        agregarContacto();
    }
    
    // Escape para cancelar
    if (e.key === 'Escape') {
        if (confirmarDescartarCambios()) {
            window.history.back();
        }
    }
});

// Prevenir pérdida accidental de datos
window.addEventListener('beforeunload', function(e) {
    const formulario = document.querySelector('form');
    if (formulario) {
        const campos = formulario.querySelectorAll('input, select, textarea');
        let hayCambios = false;
        
        campos.forEach(campo => {
            if (campo.value !== campo.defaultValue) {
                hayCambios = true;
            }
        });
        
        if (hayCambios) {
            e.preventDefault();
            e.returnValue = '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.';
        }
    }
});

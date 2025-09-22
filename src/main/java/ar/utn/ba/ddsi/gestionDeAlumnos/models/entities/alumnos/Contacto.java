package ar.utn.ba.ddsi.gestionDeAlumnos.models.entities.alumnos;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Contacto {
    private Long id;
    private TipoContacto tipoContacto;
    private String valor;
}

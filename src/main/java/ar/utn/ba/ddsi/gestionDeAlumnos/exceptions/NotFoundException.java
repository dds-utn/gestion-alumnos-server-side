package ar.utn.ba.ddsi.gestionDeAlumnos.exceptions;

import ar.utn.ba.ddsi.gestionDeAlumnos.models.entities.Alumno;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String entidad, String id) {
        super("No se ha encontrado " + entidad + " de id " + id);
    }
}

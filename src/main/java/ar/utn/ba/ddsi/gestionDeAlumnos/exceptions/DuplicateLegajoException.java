package ar.utn.ba.ddsi.gestionDeAlumnos.exceptions;

public class DuplicateLegajoException extends RuntimeException {

    public DuplicateLegajoException(String legajo) {
        super("El legajo " + legajo + " ya existe");
    }
}

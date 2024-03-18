package swp.group5.swp_interior_project.exception;

import jakarta.persistence.EntityNotFoundException;

public class NotFoundEntityException extends EntityNotFoundException {
    public NotFoundEntityException(String message) {
        super(message);
    }
}

package swp.group5.swp_interior_project.controller.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import swp.group5.swp_interior_project.exception.DuplicateEntityException;
import swp.group5.swp_interior_project.utils.ErrorResponseBuilder;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsException(BadCredentialsException ignoredE) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseEntity<?> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(
                ErrorResponseBuilder.buildErrorResponse(
                        "Invalid input",
                        "Invalid input. Please check your input data.",
                        400, errors
                )
        );
    }
    
    @ExceptionHandler(DuplicateEntityException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ResponseEntity<?> handleDuplicateCustomerException(DuplicateEntityException ex) {
        List<String> error = Collections.singletonList("Duplicate entity: " + ex.getMessage());
        return ResponseEntity.badRequest().body(
                ErrorResponseBuilder.buildErrorResponse(
                        "Duplicate entity",
                        "The requested resource already exists.",
                        409, error
                )
        );
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex) {
        List<String> errors = Collections.singletonList("Forbidden: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponseBuilder.buildErrorResponse(
                        "AccessDenied",
                        "Not have access for this function",
                        403, errors
                ));
    }
    
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<?> handleIOException(IOException ex) {
        List<String> errors = Collections.singletonList("Error creating Excel file: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponseBuilder.buildErrorResponse(
                        "Internal Server Error",
                        "An error occurred while creating the Excel file.",
                        500, errors
                ));
    }
    
}

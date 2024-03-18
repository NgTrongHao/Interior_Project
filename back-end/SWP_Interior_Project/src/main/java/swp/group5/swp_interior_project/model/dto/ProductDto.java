package swp.group5.swp_interior_project.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    @NotEmpty(message = "Product name is required")
    private String name;
    private String description;
    @NotNull(message = "Product price is required")
    @DecimalMin(value = "0", inclusive = false, message = "Product price must be greater than 0")
    private BigDecimal price;
}

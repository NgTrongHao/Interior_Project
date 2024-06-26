package swp.group5.swp_interior_project.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Long productId;
    private String productName;
    private Integer quantity;
    private String description;
    private Double length;
    private Double width;
    private Double height;
}

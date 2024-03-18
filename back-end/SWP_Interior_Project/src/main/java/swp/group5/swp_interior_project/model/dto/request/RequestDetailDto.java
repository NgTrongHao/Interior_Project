package swp.group5.swp_interior_project.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestDetailDto {
    private Long id;
    private String requestVersionId;
    private List<ProductDetailDto> products;
    private String workspaceName;
    private String description;
    private BigDecimal length;
    private BigDecimal width;
}


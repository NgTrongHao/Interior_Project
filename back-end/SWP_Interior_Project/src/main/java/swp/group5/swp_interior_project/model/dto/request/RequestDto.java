package swp.group5.swp_interior_project.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp.group5.swp_interior_project.model.dto.ProposalDto;
import swp.group5.swp_interior_project.model.dto.user.customer.CustomerDto;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto {
    private UUID id;
    private BigDecimal price;
    private RequestStatus customerRequestStatus;
    private String customerRequestStatusDescription;
    private RequestStatus employeeRequestStatus;
    private String employeeRequestStatusDescription;
    private CustomerDto customer;
    private List<RequestDetailDto> requestDetails;
    private ProposalDto proposal;
    
    public String getCustomerRequestStatusDescription() {
        return customerRequestStatus != null ? customerRequestStatus.getDescription() : null;
    }
    
    public String getEmployeeRequestStatusDescription() {
        return employeeRequestStatus != null ? employeeRequestStatus.getDescription() : null;
    }
}

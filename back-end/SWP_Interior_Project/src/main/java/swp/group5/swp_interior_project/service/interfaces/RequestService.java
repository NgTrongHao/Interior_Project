package swp.group5.swp_interior_project.service.interfaces;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import swp.group5.swp_interior_project.model.dto.request.RequestDto;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.util.List;
import java.util.UUID;

public interface RequestService {
    Request addRequest(RequestDto requestDto);
    
    Request getRequestById(UUID requestId);
    
    RequestDto convertRequest(Request request);
    
    List<RequestDto> getRequestsByStatusAndPagination(RequestStatus status, Pageable pageable);
    
    List<RequestDto> getRequestByCustomer(String customerUsername, Pageable pageable);
    
    Request adjustAndConfirmRequest(UUID requestId, RequestDto requestDto, String username);
    
    Request updateRequestByCustomer(UUID requestId, RequestDto requestDto, String username);
    
    List<Object[]> getMonthlyTotalPrice();
    
    List<Object[]> getAverageWaitingTimeForLast7Days();
}

package swp.group5.swp_interior_project.service.interfaces;

import swp.group5.swp_interior_project.model.dto.request.RequestStatusHistoryDto;
import swp.group5.swp_interior_project.model.entity.RequestStatusHistory;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.model.entity.UserInfo;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.util.List;

public interface RequestStatusHistoryService {
    RequestStatusHistory createNewRequestStatusHistory(RequestVersion requestVersion, RequestStatus requestStatus, UserInfo userInfo);
    
    RequestStatusHistory getLastStatusHistory(RequestVersion requestVersion);
    
    List<Object[]> getMonthlyTotalPrice();
    
    List<Object[]> getAverageWaitingTimeForLast7Days();
    
    RequestStatusHistoryDto convertRequestStatusHistory(RequestStatusHistory requestStatusHistory);
}

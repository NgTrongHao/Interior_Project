package swp.group5.swp_interior_project.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.model.dto.request.RequestStatusHistoryDto;
import swp.group5.swp_interior_project.model.entity.RequestStatusHistory;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.model.entity.UserInfo;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.repository.RequestStatusHistoryRepository;
import swp.group5.swp_interior_project.service.interfaces.RequestStatusHistoryService;
import swp.group5.swp_interior_project.service.interfaces.UserInfoService;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class RequestStatusHistoryServiceImpl implements RequestStatusHistoryService {
    private final RequestStatusHistoryRepository requestStatusHistoryRepository;
    private final UserInfoService userInfoService;
    
    @Autowired
    public RequestStatusHistoryServiceImpl(RequestStatusHistoryRepository requestStatusHistoryRepository, UserInfoService userInfoService) {
        this.requestStatusHistoryRepository = requestStatusHistoryRepository;
        this.userInfoService = userInfoService;
    }
    
    @Override
    public RequestStatusHistory createNewRequestStatusHistory(RequestVersion requestVersion, RequestStatus requestStatus, UserInfo userInfo) {
        RequestStatusHistory requestStatusHistory = new RequestStatusHistory();
        requestStatusHistory.setStatus(requestStatus);
        requestStatusHistory.setRequestVersion(requestVersion);
        requestStatusHistory.setUser(userInfoService.findByUsername(userInfo.getUsername()));
        return requestStatusHistoryRepository.save(requestStatusHistory);
    }
    
    @Override
    public RequestStatusHistory getLastStatusHistory(RequestVersion requestVersion) {
        List<RequestStatusHistory> sortedStatusHistories = requestVersion.getStatusHistories();
        sortedStatusHistories.sort(Comparator.comparing(RequestStatusHistory::getDateTime));
        return sortedStatusHistories.isEmpty() ? null : sortedStatusHistories.getLast();
    }
    
    @Override
    public List<Object[]> getMonthlyTotalPrice() {
        return requestStatusHistoryRepository.getMonthlyTotalPriceWithMonthNames();
    }
    
    public List<Object[]> getAverageWaitingTimeForLast7Days() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        
        // Gọi phương thức từ repository để lấy dữ liệu
        return requestStatusHistoryRepository.getAverageWaitingTimeForLast7Days(startDate);
    }
    
    @Override
    public RequestStatusHistoryDto convertRequestStatusHistory(RequestStatusHistory requestStatusHistory) {
        RequestStatusHistoryDto statusHistoryDto = new RequestStatusHistoryDto();
        statusHistoryDto.setId(requestStatusHistory.getId());
        statusHistoryDto.setRequestStatus(requestStatusHistory.getStatus());
        statusHistoryDto.setUser(userInfoService.getUserInfoProfileByUsername(requestStatusHistory.getUser().getUsername()));
        statusHistoryDto.setDateTime(requestStatusHistory.getDateTime());
        return statusHistoryDto;
    }
}

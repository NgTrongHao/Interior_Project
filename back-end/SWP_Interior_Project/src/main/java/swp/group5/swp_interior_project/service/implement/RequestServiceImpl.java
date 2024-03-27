package swp.group5.swp_interior_project.service.implement;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.request.RequestDto;
import swp.group5.swp_interior_project.model.dto.request.RequestVersionDto;
import swp.group5.swp_interior_project.model.entity.*;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.repository.RequestRepository;
import swp.group5.swp_interior_project.service.interfaces.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {
    private final RequestRepository requestRepository;
    private final RequestDetailService requestDetailService;
    private final RequestVersionService requestVersionService;
    private final RequestStatusHistoryService requestStatusHistoryService;
    private final UserInfoService userInfoService;
    private final ProposalService proposalService;
    
    @Autowired
    public RequestServiceImpl(RequestRepository requestRepository, RequestDetailService requestDetailService, RequestVersionService requestVersionService, RequestStatusHistoryService requestStatusHistoryService, UserInfoService userInfoService, ProposalService proposalService) {
        this.requestRepository = requestRepository;
        this.requestDetailService = requestDetailService;
        this.requestVersionService = requestVersionService;
        this.requestStatusHistoryService = requestStatusHistoryService;
        this.userInfoService = userInfoService;
        this.proposalService = proposalService;
    }
    
    @Override
    @Transactional
    public Request addRequest(RequestDto requestDto) {
        
        Request request, saveRequest;
        
        RequestVersion requestVersion;
        
        UserInfo userInfo;
        
        if (requestDto.getId() != null) {
            request = requestRepository.findById(requestDto.getId()).orElseThrow(null);
            
            userInfo = request.getCustomer();
            
            request.setRequestStatusEmployee(RequestStatus.CONSTRUCTION_REJECTED);
            request.setRequestStatusCustomer(RequestStatus.REQUESTED);
            
            // Save the request
            saveRequest = requestRepository.save(request);
            
            requestVersion = requestVersionService.createNewRequestVersion(saveRequest, request.getVersions().size() + 1);
        } else {
            // Create a new Request object
            request = new Request();
            
            // Find user information
            userInfo = userInfoService.findByUsername(requestDto.getCustomer().getEmail());
            
            // Set user information for the request
            request.setCustomer(userInfo);
            
            request.setRequestStatusEmployee(RequestStatus.REQUESTED);
            request.setRequestStatusCustomer(RequestStatus.REQUESTED);
            
            // Save the request
            saveRequest = requestRepository.save(request);
            
            // Create a new request version
            requestVersion = requestVersionService.createNewRequestVersion(saveRequest, 1);
        }
        
        // Create request detail list from DTO and add to request version
        List<RequestDetail> requestDetailList = requestDto.getRequestDetails().stream()
                .map(requestDetailDto -> requestDetailService.createRequestDetail(requestVersion, requestDetailDto))
                .peek(requestDetail -> requestVersion.getRequestDetails().add(requestDetail))
                .toList();
        
        // Calculate total estimated price from request detail list
        BigDecimal estimateCost = getEstimatePrice(requestDetailList);
        
        // Set the estimated price for the request
        saveRequest.setEstimatedPrice(estimateCost);
        saveRequest.setPrice(estimateCost);
        
        // Add the request version to the request's version list
        saveRequest.getVersions().add(requestVersion);
        
        // Create new request status history
        RequestStatusHistory requestStatusHistory = requestStatusHistoryService.createNewRequestStatusHistory(requestVersion, RequestStatus.REQUESTED, userInfo);
        if (requestVersion.getStatusHistories() != null) {
            requestVersion.getStatusHistories().add(requestStatusHistory);
        } else {
            List<RequestStatusHistory> requestStatusHistories = new ArrayList<>();
            requestStatusHistories.add(requestStatusHistory);
            requestVersion.setStatusHistories(requestStatusHistories);
        }
        return requestRepository.save(saveRequest);
    }
    
    private static BigDecimal getEstimatePrice(List<RequestDetail> requestDetailList) {
        BigDecimal estimateCost = BigDecimal.ZERO;
        for (RequestDetail requestDetail : requestDetailList) {
            for (RequestDetailProduct product : requestDetail.getRequestDetailProducts()) {
                BigDecimal productPrice = product.getProduct().getPrice();
                int productQuantity = product.getQuantity();
                BigDecimal productTotalPrice = productPrice.multiply(BigDecimal.valueOf(productQuantity));
                estimateCost = estimateCost.add(productTotalPrice);
            }
        }
        return estimateCost;
    }
    
    @Override
    public Request getRequestById(UUID requestId) {
        return requestRepository.findById(requestId).orElseThrow(() -> new NotFoundEntityException("Request not found"));
    }
    
    @Override
    public RequestDto convertRequest(Request request) {
        RequestDto requestDto = new RequestDto();
        requestDto.setId(request.getId());
        requestDto.setRequestDetails(
                request.getVersions().getLast().getRequestDetails().stream().map(
                        requestDetailService::convertRequestDetail
                ).toList()
        );
        requestDto.setEmployeeRequestStatus(request.getRequestStatusEmployee());
        requestDto.setCustomerRequestStatus(request.getRequestStatusCustomer());
        requestDto.setCustomer(userInfoService.convertCustomer(request.getCustomer()));
        requestDto.setPrice(request.getEstimatedPrice());
        
        System.out.println(requestStatusHistoryService.getLastStatusHistory(requestVersionService.getLastRequestVersionByRequest(request)).getId());
        Proposal proposal = requestStatusHistoryService.getLastStatusHistory(requestVersionService.getLastRequestVersionByRequest(request)).getProposal();
        if (proposal != null) {
            requestDto.setProposal(proposalService.convertProposal(proposal));
            if (request.getRequestStatusEmployee().equals(RequestStatus.MANAGER_APPROVED)) {
                requestDto.setPrice(request.getPrice());
            }
        }
        
        return requestDto;
    }
    
    @Override
    public List<RequestDto> getRequestsByStatusAndPagination(RequestStatus status, Pageable pageable) {
        Page<Request> requestPage = requestRepository.findByRequestStatusEmployee(status, pageable);
        return requestPage.getContent().stream()
                .map(this::convertRequest).collect(Collectors.toList());
    }
    
    @Override
    public List<RequestDto> getRequestByCustomer(String customerUsername, Pageable pageable) {
        Page<Request> requestPage = requestRepository.findByCustomerUsername(customerUsername, pageable);
        return requestPage.getContent().stream()
                .map(this::convertRequest).collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Request adjustAndConfirmRequest(UUID requestId, RequestDto requestDto, String username) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundEntityException("Request not found"));
        if (request.getRequestStatusCustomer() == RequestStatus.QUOTATION_PROCESSING) {
            throw new RuntimeException("Cannot edit a confirmed request.");
        }
        
        RequestVersion requestVersion = requestVersionService.updateRequestDetailsList(request.getVersions().getLast(), requestDto.getRequestDetails());
        
        BigDecimal estimatedPrice = getEstimatePrice(requestVersion);
        request.setEstimatedPrice(estimatedPrice);
        request.setRequestStatusCustomer(RequestStatus.QUOTATION_PROCESSING);
        request.setRequestStatusEmployee(RequestStatus.WAITING_FOR_PLANNING);
        
        UserInfo userInfo = userInfoService.findByUsername(username);
        requestStatusHistoryService.createNewRequestStatusHistory(requestVersion, RequestStatus.WAITING_FOR_PLANNING, userInfo);
        return requestRepository.save(request);
    }
    
    private static BigDecimal getEstimatePrice(RequestVersion requestVersion) {
        BigDecimal estimatedPrice = BigDecimal.ZERO;
        for (RequestDetail requestDetail : requestVersion.getRequestDetails()) {
            for (RequestDetailProduct product : requestDetail.getRequestDetailProducts()) {
                BigDecimal productPrice = product.getProduct().getPrice();
                int productQuantity = product.getQuantity();
                BigDecimal productTotalPrice = productPrice.multiply(BigDecimal.valueOf(productQuantity));
                estimatedPrice = estimatedPrice.add(productTotalPrice);
            }
        }
        return estimatedPrice;
    }
    
    @Override
    @Transactional
    public Request updateRequestByCustomer(UUID requestId, RequestDto requestDto, String username) {
        Request request;
        request = requestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundEntityException("Request not found"));
        if (request.getRequestStatusCustomer() == RequestStatus.QUOTATION_PROCESSING) {
            throw new RuntimeException("Cannot edit a confirmed request.");
        }
        
        RequestVersion requestVersion = requestVersionService.updateRequestDetailsList(request.getVersions().getLast(), requestDto.getRequestDetails());
        
        BigDecimal estimatedPrice = getEstimatePrice(requestVersion);
        request.setEstimatedPrice(estimatedPrice);
        
        return requestRepository.save(request);
    }
    
    @Override
    public List<Object[]> getMonthlyTotalPrice() {
        return requestStatusHistoryService.getMonthlyTotalPrice();
    }
    
    @Override
    public List<Object[]> getAverageWaitingTimeForLast7Days() {
        return requestStatusHistoryService.getAverageWaitingTimeForLast7Days();
    }
    
    @Override
    public List<RequestVersionDto> getRequestHistoryList(UUID requestId) {
        Request request = getRequestById(requestId);
        return request.getVersions().stream().map(requestVersionService::convertRequestVersion).toList();
    }
    
    @Override
    public List<RequestDto> getRequestListByUser(String username) {
        return requestRepository.findRequestListByUser(username).stream()
                .map(this::getRequestById)
                .map(this::convertRequest)
                .toList();
    }
}

package swp.group5.swp_interior_project.service.implement;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.request.RequestDetailDto;
import swp.group5.swp_interior_project.model.dto.request.RequestDto;
import swp.group5.swp_interior_project.model.dto.request.RequestVersionDto;
import swp.group5.swp_interior_project.model.entity.*;
import swp.group5.swp_interior_project.model.enums.ProductUnit;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.repository.RequestRepository;
import swp.group5.swp_interior_project.service.interfaces.*;
import swp.group5.swp_interior_project.service.report.ExcelService;

import java.io.IOException;
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
    private final ExcelService excelService;
    
    @Autowired
    public RequestServiceImpl(RequestRepository requestRepository, RequestDetailService requestDetailService, RequestVersionService requestVersionService, RequestStatusHistoryService requestStatusHistoryService, UserInfoService userInfoService, ProposalService proposalService, ExcelService excelService) {
        this.requestRepository = requestRepository;
        this.requestDetailService = requestDetailService;
        this.requestVersionService = requestVersionService;
        this.requestStatusHistoryService = requestStatusHistoryService;
        this.userInfoService = userInfoService;
        this.proposalService = proposalService;
        this.excelService = excelService;
    }
    
    @Override
    @Transactional
    public Request addRequest(RequestDto requestDto) {
        Request request = createOrUpdateRequest(requestDto);
        return requestRepository.save(request);
    }
    
    private Request createOrUpdateRequest(RequestDto requestDto) {
        Request request;
        if (requestDto.getId() != null) {
            request = getRequestById(requestDto.getId());
            request.setRequestStatusEmployee(RequestStatus.CONSTRUCTION_REJECTED);
            request.setRequestStatusCustomer(RequestStatus.REQUESTED);
        } else {
            request = new Request();
            UserInfo userInfo = getUserInfo(requestDto.getCustomer().getEmail());
            request.setCustomer(userInfo);
            request.setRequestStatusEmployee(RequestStatus.REQUESTED);
            request.setRequestStatusCustomer(RequestStatus.REQUESTED);
        }
        
        Request saveRequest = requestRepository.save(request);
        
        RequestVersion requestVersion = createRequestVersion(saveRequest);
        saveRequest.getVersions().add(requestVersion);
        
        RequestStatusHistory requestStatusHistory = createRequestStatusHistory(request, RequestStatus.REQUESTED, request.getCustomer());
        if (requestVersion.getStatusHistories() != null) {
            requestVersion.getStatusHistories().add(requestStatusHistory);
        } else {
            List<RequestStatusHistory> requestStatusHistories = new ArrayList<>();
            requestStatusHistories.add(requestStatusHistory);
            requestVersion.setStatusHistories(requestStatusHistories);
        }
        
        List<RequestDetail> requestDetailList = createRequestDetails(requestVersion, requestDto.getRequestDetails());
        BigDecimal estimateCost = calculateEstimatePrice(requestDetailList);
        
        saveRequest.setEstimatedPrice(estimateCost);
        saveRequest.setPrice(estimateCost);
        
        return request;
    }
    
    private UserInfo getUserInfo(String username) {
        return userInfoService.findByUsername(username);
    }
    
    private RequestVersion createRequestVersion(Request request) {
        return requestVersionService.createNewRequestVersion(request, request.getVersions().size() + 1);
    }
    
    private RequestStatusHistory createRequestStatusHistory(Request request, RequestStatus status, UserInfo userInfo) {
        RequestVersion lastRequestVersion = request.getVersions().getLast();
        return requestStatusHistoryService.createNewRequestStatusHistory(lastRequestVersion, status, userInfo);
    }
    
    private List<RequestDetail> createRequestDetails(RequestVersion requestVersion, List<RequestDetailDto> requestDetailDtoList) {
        return requestDetailDtoList.stream()
                .map(dto -> requestDetailService.createRequestDetail(requestVersion, dto))
                .peek(requestDetail -> requestVersion.getRequestDetails().add(requestDetail))
                .collect(Collectors.toList());
    }
    
    private BigDecimal calculateEstimatePrice(List<RequestDetail> requestDetailList) {
        BigDecimal estimateCost = BigDecimal.ZERO;
        for (RequestDetail requestDetail : requestDetailList) {
            for (RequestDetailProduct product : requestDetail.getRequestDetailProducts()) {
                BigDecimal productPrice = product.getProduct().getPrice();
                int productQuantity = product.getQuantity();
                BigDecimal productSpecification = BigDecimal.valueOf(1);
                if (product.getProduct().getUnit().equals(ProductUnit.m2)) {
                    productSpecification = BigDecimal.valueOf(product.getLength() * product.getWidth());
                }
                BigDecimal productTotalPrice = productPrice.multiply(BigDecimal.valueOf(productQuantity).multiply(productSpecification));
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
        
        BigDecimal estimatedPrice = calculateEstimatePrice(requestVersion.getRequestDetails());
        request.setEstimatedPrice(estimatedPrice);
        request.setRequestStatusCustomer(RequestStatus.QUOTATION_PROCESSING);
        request.setRequestStatusEmployee(RequestStatus.WAITING_FOR_PLANNING);
        
        UserInfo userInfo = userInfoService.findByUsername(username);
        //requestStatusHistoryService.createNewRequestStatusHistory(requestVersion, RequestStatus.WAITING_FOR_PLANNING, userInfo);
        createRequestStatusHistory(request, RequestStatus.WAITING_FOR_PLANNING, userInfo);
        return requestRepository.save(request);
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
        
        BigDecimal estimatedPrice = calculateEstimatePrice(requestVersion.getRequestDetails());
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
    
    @Override
    public String writeRequestVersionToExcel(UUID requestId, String outputDirectory) throws IOException {
        RequestVersion requestVersion = getRequestById(requestId).getVersions().getLast();
        return excelService.writeRequestVersionToExcel(outputDirectory, requestVersion);
    }
}

package swp.group5.swp_interior_project.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import swp.group5.swp_interior_project.model.dto.ProposalDto;
import swp.group5.swp_interior_project.model.dto.request.RequestDto;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.service.interfaces.ProposalService;
import swp.group5.swp_interior_project.service.interfaces.RequestService;
import swp.group5.swp_interior_project.service.session.LockService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/request")
public class RequestController {
    private final RequestService requestService;
    private final ProposalService proposalService;
    private final LockService lockService;
    
    public RequestController(RequestService requestService, ProposalService proposalService, LockService lockService) {
        this.requestService = requestService;
        this.proposalService = proposalService;
        this.lockService = lockService;
    }
    
    // Endpoint to get requests by status with pagination
    
    /**
     * API Endpoint: /api/v1/request/auth/status/{status}?page=<pageInt>&pageSize=<pageSize>
     * Method: GET
     * Description: Get a list of requests by status with pagination.
     * Input Parameters:
     * status (RequestStatus) - Status of the requests (path variable).
     * page (int) - Page number for pagination (query parameter, default value: 1).
     * pageSize (int) - Page size for pagination (query parameter, default value: 10).
     * Expected Output: A list of requests (RequestDto) with the specified status and pagination.
     */
    @GetMapping("/auth/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_MANAGER')")
    public List<RequestDto> getRequestsByStatus(
            @PathVariable RequestStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return requestService.getRequestsByStatusAndPagination(status, pageable);
    }
    
    // Endpoint to get requests by customer with pagination
    
    /**
     * API Endpoint: /api/v1/request/auth/customer?page=<pageInt>&pageSize=<pageSize>
     * Method: GET
     * Description: Get a list of requests by customer with pagination.
     * Input Parameters:
     * customerUsername (String) - Username of the customer (path variable).
     * page (int) - Page number for pagination (query parameter, default value: 1).
     * pageSize (int) - Page size for pagination (query parameter, default value: 10).
     * Expected Output: A list of requests (RequestDto) made by the specified customer and pagination.
     */
    @GetMapping("/auth/customer")
    public List<RequestDto> getRequestByCustomer(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return requestService.getRequestByCustomer(username, pageable);
    }
    
    @GetMapping("/auth/customer/{requestId}")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<?> getCustomerRequestById(@PathVariable UUID requestId) {
        RequestDto requestDto = requestService.convertRequest(requestService.getRequestById(requestId));
        return ResponseEntity.status(HttpStatus.OK).body(requestDto);
    }
    
    // Endpoint to add a new request
    
    /**
     * API Endpoint: /api/v1/request
     * Method: POST
     * Description: Add a new request to the system.
     * Input Parameters: Data of the request (RequestDto) to be added (request body).
     * Expected Output: The created request (RequestDto).
     */
    @PostMapping("/auth")
    public ResponseEntity<?> addRequest(@Valid @RequestBody RequestDto requestDto) {
        RequestDto createdRequest = requestService.convertRequest(requestService.addRequest(requestDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }
    
    // Endpoint to retrieve a request by ID
    
    /**
     * API Endpoint: /api/v1/request/auth/{requestId}
     * Method: GET
     * Description: This API endpoint allows authorized staff members (with ROLE_STAFF or ROLE_MANAGER authority)
     *              to retrieve a request by its unique requestId.
     * Input Parameters:
     *   - requestId (UUID): The ID of the request to be retrieved (path variable).
     *   - session (HttpSession): HttpSession object to manage request locking.
     * Expected Output:
     *   - If the request is successfully retrieved, it will be returned in the response body as a RequestDto object.
     *   - If the request is already locked by another staff member, a LOCKED status response will be returned.
     * Note: This endpoint requires authentication and authorization based on the user's role and permissions.
     *       The lockService is used to prevent concurrent editing of the same request by multiple staff members.
     *       If the request is not locked, it will be locked for the current session before returning the request details.
     *       The requestService is responsible for retrieving and converting the request details into a RequestDto object.
     */
    
    @GetMapping("/auth/{requestId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_MANAGER')")
    public ResponseEntity<?> getRequestById(@PathVariable UUID requestId, HttpSession session) {
        if (lockService.isRequestLocked(session, requestId)) {
            return ResponseEntity.status(HttpStatus.LOCKED).body("Request is already locked by another staff member.");
        }
        lockService.lockRequest(session, requestId);
        RequestDto requestDto = requestService.convertRequest(requestService.getRequestById(requestId));
        return ResponseEntity.status(HttpStatus.OK).body(requestDto);
    }
    
    // Endpoint to unlock a request
    
    /**
     * API Endpoint: /api/v1/request/auth/{requestId}/lock
     * Method: DELETE
     * Description: Unlock a request by removing the lock associated with it.
     * Input Parameters:
     * requestId (UUID) - ID of the request to be unlocked (path variable).
     * Expected Output: Confirmation message of successful request unlocking.
     */
    @DeleteMapping("/auth/{requestId}/lock")
    public ResponseEntity<?> unlockRequest(@PathVariable UUID requestId, HttpSession session) {
        lockService.unlockRequest(session, requestId);
        return ResponseEntity.ok("Request unlocked successfully.");
    }
    
    // Endpoint to adjust and confirm a request
    
    /**
     * API Endpoint: /api/v1/request/auth/{requestId}/confirmRequest
     * Method: PUT
     * Description: Adjust and confirm a request by staff members.
     * Input Parameters:
     * requestId (UUID) - ID of the request to be adjusted and confirmed (path variable).
     * requestDto (RequestDto) - Updated details of the request (request body).
     * session (HttpSession) - HTTP session to manage request locking.
     * Expected Output: The adjusted and confirmed request (RequestDto).
     */
    @PutMapping("/auth/{requestId}/confirmRequest")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<?> adjustAndConfirmRequest(
            @PathVariable UUID requestId,
            @RequestBody RequestDto requestDto,
            HttpSession session
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        RequestDto request = requestService.convertRequest(requestService.adjustAndConfirmRequest(requestId, requestDto, username));
        lockService.unlockRequest(session, requestId);
        return ResponseEntity.status(HttpStatus.OK).body(request);
    }
    
    // Endpoint for uploading a proposal associated with a specific request
    
    /**
     * API Endpoint: /api/v1/request/auth/{requestId}/uploadProposal
     * Method: PATCH
     * Description: This API endpoint allows staff members to upload a proposal for a specific request identified by requestId.
     *              The proposal details are provided in the request body as a ProposalDto object.
     * Input Parameters:
     *   - requestId (UUID): ID of the request to which the proposal is being uploaded (path variable).
     *   - proposalDto (ProposalDto): Details of the proposal to be uploaded (request body).
     * Expected Output:
     *   - If successful, the proposal will be uploaded and associated with the specified request.
     *     Returns a success message along with the Proposal ID generated for the uploaded file.
     * Note: This endpoint requires authentication and authorization based on the user's role and permissions.
     *       The proposalService is responsible for saving the uploaded proposal and associating it with the request.
     */
    @PatchMapping("/auth/{requestId}/uploadProposal")
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    public ResponseEntity<?> uploadProposal(
            @PathVariable UUID requestId,
            @RequestBody ProposalDto proposalDto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        UUID proposalId = proposalService.saveProposal(requestId, username, proposalDto);
        return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully with Proposal ID: " + proposalId);
    }
    
    // Endpoint to confirm a proposal by the manager
    
    /**
     * API Endpoint: /api/v1/request/auth/confirmProposal/{proposalId}
     * Method: PATCH
     * Description: This API endpoint allows the manager to confirm a proposal by its unique proposalId.
     * Input Parameters:
     *   - proposalId (UUID): The ID of the proposal to be confirmed (path variable).
     * Expected Output:
     *   - If the proposal is successfully confirmed by the manager, an OK status response will be returned with a message confirming the confirmation.
     * Note: This endpoint is restricted to users with the 'ROLE_MANAGER' authority only, as specified by the PreAuthorize annotation.
     *       The confirmation action is performed by the proposalService, which requires the username of the manager performing the action.
     *       The confirmation updates the status of the proposal accordingly.
     */
    @PatchMapping("/auth/confirmProposal/{proposalId}")
    @PreAuthorize("hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> confirmProposal(@PathVariable UUID proposalId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        proposalService.confirmProposal(username, proposalId);
        return ResponseEntity.status(HttpStatus.OK).body("Proposal with id " + proposalId + " is confirmed successfully!");
    }
    
    // Endpoint to reject a proposal by the manager
    
    /**
     * API Endpoint: /api/v1/request/auth/rejectProposal/{proposalId}
     * Method: PATCH
     * Description: This API endpoint allows the manager to reject a proposal by its unique proposalId.
     * Input Parameters:
     *   - proposalId (UUID): The ID of the proposal to be rejected (path variable).
     * Expected Output:
     *   - If the proposal is successfully rejected by the manager, an OK status response will be returned with a message confirming the rejection.
     * Note: This endpoint is restricted to users with the 'ROLE_MANAGER' authority only, as specified by the PreAuthorize annotation.
     *       The rejection action is performed by the proposalService, which requires the username of the manager performing the action.
     *       The rejection updates the status of the proposal accordingly.
     */
    @PatchMapping("/auth/rejectProposal/{proposalId}")
    @PreAuthorize("hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> rejectProposal(@PathVariable UUID proposalId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        proposalService.rejectProposal(username, proposalId);
        return ResponseEntity.status(HttpStatus.OK).body("Proposal with id " + proposalId + " is rejected!");
    }
    
    // Endpoint for confirming a proposal by the customer
    
    /**
     * API Endpoint: /api/v1/proposal/auth/customer/{proposalId}/confirmProposal
     * Method: PATCH
     * Description: Allows the customer to confirm a proposal identified by proposalId.
     *              This endpoint is accessible only to users with the ROLE_CUSTOMER authority.
     * Input Parameters:
     *   - proposalId (UUID): ID of the proposal to be confirmed (path variable).
     * Expected Output:
     *   - Upon successful confirmation, the proposal status will be updated accordingly.
     *     The response will contain a success message indicating that the proposal has been confirmed by the customer.
     * Note: This endpoint requires authentication and authorization based on the user's role and permissions.
     *       The proposalService is responsible for updating the proposal status upon confirmation by the customer.
     */
    @PatchMapping("/auth/customer/{proposalId}/confirmProposal")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<?> confirmProposalByCustomer(@PathVariable UUID proposalId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        proposalService.confirmProposalByCustomer(username, proposalId);
        return ResponseEntity.status(HttpStatus.OK).body("Proposal with id " + proposalId + "is confirmed by customer!");
    }
    
    // Endpoint for rejecting a proposal by the customer
    
    /**
     * API Endpoint: /api/v1/proposal/auth/customer/{proposalId}/rejectProposal
     * Method: PATCH
     * Description: Allows the customer to reject a proposal identified by proposalId.
     *              This endpoint is accessible only to users with the ROLE_CUSTOMER authority.
     * Input Parameters:
     *   - proposalId (UUID): ID of the proposal to be rejected (path variable).
     * Expected Output:
     *   - Upon successful rejection, the proposal status will be updated accordingly.
     *     The response will contain a success message indicating that the proposal has been rejected by the customer.
     * Note: This endpoint requires authentication and authorization based on the user's role and permissions.
     *       The proposalService is responsible for updating the proposal status upon rejection by the customer.
     */
    @PatchMapping("/auth/customer/{proposalId}/rejectProposal")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<?> rejectProposalByCustomer(@PathVariable UUID proposalId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Request request = proposalService.rejectProposalByCustomer(username, proposalId);
        requestService.addRequest(requestService.convertRequest(request));
        return ResponseEntity.status(HttpStatus.OK).body("Proposal with id " + proposalId + "is rejected by customer!");
    }
    
}

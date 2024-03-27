package swp.group5.swp_interior_project.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import swp.group5.swp_interior_project.model.dto.user.authentication.AuthRequestDto;
import swp.group5.swp_interior_project.model.dto.user.authentication.AuthTokenResponse;
import swp.group5.swp_interior_project.model.dto.user.customer.CustomerDto;
import swp.group5.swp_interior_project.service.interfaces.UserInfoService;
import swp.group5.swp_interior_project.service.security.JwtService;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserInfoService userInfoService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Autowired
    public UserController(UserInfoService userInfoService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userInfoService = userInfoService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
    
    // Endpoint to authenticate user and generate JWT token
    /**
     * API Endpoint: /api/v1/user/generateToken
     * Method: POST
     * Description: Authenticate user credentials and generate JWT token for authorization.
     * Input Parameters: Authentication request data (AuthRequestDto).
     * Expected Output: JWT token and its expiration time (AuthTokenResponse).
     */
    @PostMapping("/generateToken")
    public ResponseEntity<AuthTokenResponse> authenticateAndGetToken(@Valid @RequestBody AuthRequestDto authRequest) {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
            String token = jwtService.generateToken(authentication.getName());
            return ResponseEntity.ok(new AuthTokenResponse(token, jwtService.getExpirationTime(token), userInfoService.getUserInfoProfileByUsername(authRequest.getUsername()).getRoles().stream().toList()));
    }
    
    // Endpoint to register a new customer
    /**
     * API Endpoint: /api/v1/user/registerCustomer
     * Method: POST
     * Description: Register a new customer in the system.
     * Input Parameters: Customer data (CustomerDto).
     * Expected Output: Confirmation message of successful customer registration.
     */
    @PostMapping("/registerCustomer")
    public ResponseEntity<?> addCustomer(@Valid @RequestBody CustomerDto customerDto) {
        userInfoService.addCustomer(customerDto);
        return ResponseEntity.ok("Customer added successfully!");
    }
    
    // Endpoint to retrieve user profile
    /**
     * API Endpoint: /api/v1/user/auth/userProfile
     * Method: GET
     * Description: Retrieve the profile information of the authenticated user.
     * Input Parameters: None
     * Expected Output: Profile information of the user (UserDto).
     */
    @GetMapping("/auth/userProfile")
    public ResponseEntity<CustomerDto> userProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        CustomerDto customerInfoProfileDto = userInfoService.getCustomerInfoProfileByUsername(username);
        if (customerInfoProfileDto == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customerInfoProfileDto, HttpStatus.OK);
    }
    
    @PatchMapping("/auth/editProfile")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<?> editProfile(@RequestBody CustomerDto customerDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        userInfoService.updateCustomer(username, customerDto);
        return ResponseEntity.ok("Customer update successfully!");
    }
}

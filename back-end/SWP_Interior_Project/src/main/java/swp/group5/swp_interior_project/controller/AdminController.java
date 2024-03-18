package swp.group5.swp_interior_project.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import swp.group5.swp_interior_project.model.dto.user.employee.EmployeeDto;
import swp.group5.swp_interior_project.model.enums.AccountRole;
import swp.group5.swp_interior_project.service.interfaces.UserInfoService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    
    private final UserInfoService userInfoService;
    
    @Autowired
    public AdminController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }
    
    // Endpoint to add a new employee
    /**
     * API Endpoint: /api/v1/admin/addEmployee
     * Method: POST
     * Description: Add a new employee to the system.
     * Input Parameters: Data of the employee (EmployeeDto)
     * Expected Output: Confirmation message of successfully adding the employee.
     */
    @PostMapping("/addEmployee")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addEmployee(@Valid @RequestBody EmployeeDto employeeDto){
        userInfoService.addEmployee(employeeDto);
        return ResponseEntity.ok("Employee added successfully!");
    }
    
    // Endpoint to get all user roles
    /**
     * API Endpoint: /api/v1/admin/roles
     * Method: GET
     * Description: Get a list of all user roles.
     * Input Parameters: None
     * Expected Output: A list of user roles (AccountRole).
     */
    @GetMapping("/roles")
    public ResponseEntity<List<AccountRole>> getAllRoles() {
        List<AccountRole> roles = Arrays.asList(AccountRole.values());
        return ResponseEntity.ok(roles);
    }
    
    // Endpoint for retrieving all employees with pagination
    
    /**
     * API Endpoint: /api/v1/dashboard/getAllEmployee
     * Method: GET
     * Description: Retrieves a list of all employees with pagination support.
     * Input Parameters:
     *   - page (int, optional, default: 1): Page number for pagination.
     *   - pageSize (int, optional, default: 10): Number of employees per page.
     * Expected Output:
     *   - Returns a list of EmployeeDto objects containing details of employees within the specified page.
     * Note: This endpoint allows pagination to manage large datasets efficiently.
     *       The userInfoService is responsible for retrieving employee data with pagination support.
     */
    @GetMapping("/getAllEmployee")
    public List<EmployeeDto> getAllEmployee(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return userInfoService.getAllEmployeeAndPagination(pageable);
    }
    
    // Endpoint for retrieving an employee by ID
    
    /**
     * API Endpoint: /api/v1/dashboard/getEmployeeById/{employeeId}
     * Method: GET
     * Description: Retrieves details of an employee identified by employeeId.
     * Input Parameters:
     *   - employeeId (Long): ID of the employee to be retrieved (path variable).
     * Expected Output:
     *   - Returns the details of the employee as an EmployeeDto object.
     * Note: This endpoint retrieves details of a specific employee based on the provided employeeId.
     *       If the employeeId does not exist, a NOT_FOUND response will be returned.
     */
    @GetMapping("/getEmployee/{employeeId}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long employeeId) {
        return ResponseEntity.ok(userInfoService.findById(employeeId));
    }
    
    // Endpoint for updating employee details by ID
    
    /**
     * API Endpoint: /api/v1/employees/updateEmployee/{employeeId}
     * Method: PATCH
     * Description: Updates the details of an employee identified by employeeId.
     * Input Parameters:
     *   - employeeId (Long): ID of the employee to be updated (path variable).
     *   - updatedEmployee (EmployeeDto): Updated details of the employee (request body).
     * Expected Output:
     *   - If successful, the employee details will be updated.
     *     Returns a success message indicating that the employee has been updated successfully.
     * Note: This endpoint allows for updating various details of an employee such as name, email, role, etc.
     *       The updatedEmployee parameter should contain the new details of the employee.
     *       The userInfoService is responsible for updating the employee details in the database.
     */
    @PatchMapping("/updateEmployee/{employeeId}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long employeeId, @RequestBody EmployeeDto updatedEmployee) {
        userInfoService.updateEmployee(employeeId, updatedEmployee);
        return ResponseEntity.ok("Employee updated successfully!");
    }
    
    // Endpoint for updating employee status by ID
    
    /**
     * API Endpoint: /api/v1/employees/{status}/{employeeId}
     * Method: PATCH
     * Description: Updates the status of an employee identified by employeeId.
     * Input Parameters:
     *   - employeeId (Long): ID of the employee whose status is to be updated (path variable).
     *   - status (boolean): New status of the employee (path variable).
     * Expected Output:
     *   - If successful, the status of the employee will be updated.
     *     Returns a success message indicating that the employee status has been updated successfully.
     * Note: This endpoint allows for updating the status of an employee, typically for enabling or disabling their account.
     *       The status parameter should be a boolean value indicating the new status (true for enabled, false for disabled).
     *       The userInfoService is responsible for updating the employee status in the database.
     */
    @PatchMapping("/{status}/{employeeId}")
    public ResponseEntity<?> updateEmployeeStatus(@PathVariable Long employeeId, @PathVariable boolean status) {
        userInfoService.updateEmployeeStatus(employeeId, status);
        return ResponseEntity.ok("Employee updated successfully!");
    }
}

package swp.group5.swp_interior_project.service.interfaces;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;
import swp.group5.swp_interior_project.model.dto.user.UserDto;
import swp.group5.swp_interior_project.model.dto.user.customer.CustomerDto;
import swp.group5.swp_interior_project.model.dto.user.employee.EmployeeDto;
import swp.group5.swp_interior_project.model.entity.UserInfo;
import swp.group5.swp_interior_project.model.enums.AccountRole;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.util.List;

public interface UserInfoService extends UserDetailsService {
    void addCustomer(CustomerDto customerDto);
    
    void addEmployee(EmployeeDto employeeDto);
    
    UserDto getUserInfoProfileByUsername(String username);
    
    UserInfo findByUsername(String username);
    
    List<UserInfo> getStaff();
    
    UserInfo convertCustomer(CustomerDto customerDto);
    
    CustomerDto convertCustomer(UserInfo userInfo);
    
    List<Object[]> findStaffAndTotalPriceByRoleAndStatus(AccountRole role, RequestStatus status);
    
    List<EmployeeDto> getAllEmployeeAndPagination(Pageable pageable);
    
    EmployeeDto findById(Long employeeId);
    
    void updateEmployee(Long id, EmployeeDto updatedEmployee);
    
    void updateEmployeeStatus(Long employeeId, boolean status);
}

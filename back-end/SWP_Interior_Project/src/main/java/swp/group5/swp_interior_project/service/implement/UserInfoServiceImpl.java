package swp.group5.swp_interior_project.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.exception.DuplicateEntityException;
import swp.group5.swp_interior_project.exception.NotFoundEntityException;
import swp.group5.swp_interior_project.model.dto.user.UserDto;
import swp.group5.swp_interior_project.model.dto.user.customer.CustomerDto;
import swp.group5.swp_interior_project.model.dto.user.employee.EmployeeDto;
import swp.group5.swp_interior_project.model.entity.UserInfo;
import swp.group5.swp_interior_project.model.enums.AccountRole;
import swp.group5.swp_interior_project.model.enums.RequestStatus;
import swp.group5.swp_interior_project.repository.UserInfoRepository;
import swp.group5.swp_interior_project.service.interfaces.MailSenderService;
import swp.group5.swp_interior_project.service.interfaces.UserInfoService;
import swp.group5.swp_interior_project.service.security.UserInfoDetails;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserInfoServiceImpl implements UserInfoService {
    
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private MailSenderService mailSenderService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userDetail = userInfoRepository.findByUsername(username);
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
    }
    
    @Override
    public void addCustomer(CustomerDto customerDto) {
        if (userInfoRepository.existsByEmailOrPhoneOrUsername(customerDto.getEmail(), customerDto.getPhone(), customerDto.getEmail())) {
            throw new DuplicateEntityException("Customer with the same email or phone already exists");
        }
        UserInfo user = convertCustomer(customerDto);
        userInfoRepository.save(user);
        
        // Consider sending a welcome email or notification here
        mailSenderService.sendMail(customerDto.getEmail(), "Welcome to FurnitureDesign", welcomeCustomerMessage(customerDto.getFullName(), customerDto.getEmail(), customerDto.getPhone()));
    }
    
    @Override
    public void addEmployee(EmployeeDto employeeDto) {
        if (userInfoRepository.existsByEmailOrPhoneOrUsername(employeeDto.getEmail(), employeeDto.getPhone(), employeeDto.getUsername())) {
            throw new DuplicateEntityException("Employee with the same email or phone or username already exists");
        }
        userInfoRepository.save(convertEmployee(employeeDto));
    }
    
    @Override
    public UserDto getUserInfoProfileByUsername(String username) {
        Optional<UserInfo> userInfo = userInfoRepository.findByUsername(username);
        if (userInfo.isPresent() && userInfo.get().isStatus()) {
            UserDto dto = new UserDto();
            dto.setId(userInfo.get().getId());
            dto.setFullName(userInfo.get().getFullName());
            dto.setEmail(userInfo.get().getEmail());
            dto.setPhone(userInfo.get().getPhone());
            dto.setAddress(userInfo.get().getAddress());
            dto.setRoles(userInfo.get().getRoles().stream().map(Enum::toString).collect(Collectors.toSet()));
            return dto;
        }
        throw new UsernameNotFoundException("Not found");
    }
    
    @Override
    public UserInfo findByUsername(String username) {
        return userInfoRepository.findByUsername(username).orElseThrow(() -> new NotFoundEntityException("User not found"));
    }
    
    @Override
    public List<UserInfo> getStaff() {
        return userInfoRepository.findByRolesContaining(AccountRole.ROLE_STAFF);
    }
    
    @Override
    public UserInfo convertCustomer(CustomerDto customerDto) {
        UserInfo userInfo = new UserInfo();
        userInfo.setFullName(customerDto.getFullName());
        userInfo.setEmail(customerDto.getEmail());
        userInfo.setPhone(customerDto.getPhone());
        userInfo.setIdCard(customerDto.getId_card());
        userInfo.setNote(customerDto.getNote());
        userInfo.setAddress(null);
        userInfo.setUsername(customerDto.getEmail());
        userInfo.setPassword(passwordEncoder.encode(customerDto.getPhone()));
        userInfo.setStatus(true);
        userInfo.setRoles(Set.of(AccountRole.ROLE_CUSTOMER));
        
        return userInfo;
    }
    
    @Override
    public CustomerDto convertCustomer(UserInfo userInfo) {
        CustomerDto customerDto = new CustomerDto();
        customerDto.setEmail(userInfo.getEmail());
        customerDto.setId(userInfo.getId());
        customerDto.setPhone(userInfo.getPhone());
        customerDto.setFullName(userInfo.getFullName());
        customerDto.setNote(userInfo.getNote());
        customerDto.setId_card(userInfo.getIdCard());
        customerDto.setAddress(userInfo.getAddress());
        return customerDto;
    }
    
    public UserInfo convertEmployee(EmployeeDto employeeDto) {
        UserInfo userInfo = new UserInfo();
        userInfo.setFullName(employeeDto.getFullName());
        userInfo.setEmail(employeeDto.getEmail());
        userInfo.setPhone(employeeDto.getPhone());
        userInfo.setIdCard(employeeDto.getId_card());
        userInfo.setNote(null);
        userInfo.setAddress(employeeDto.getAddress());
        userInfo.setUsername(employeeDto.getUsername());
        if (employeeDto.getPassword() == null) {
            userInfo.setPassword(passwordEncoder.encode("123456"));
        } else {
            userInfo.setPassword(passwordEncoder.encode(employeeDto.getPassword()));
        }
        userInfo.setStatus(employeeDto.isStatus());
        userInfo.setRoles(employeeDto.getRoles().stream()
                .map(AccountRole::valueOf).collect(Collectors.toSet())
        );
        return userInfo;
    }
    
    public EmployeeDto convertEmployee(UserInfo userInfo) {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId(userInfo.getId());
        employeeDto.setFullName(userInfo.getFullName());
        employeeDto.setEmail(userInfo.getEmail());
        employeeDto.setPhone(userInfo.getPhone());
        employeeDto.setId_card(userInfo.getIdCard());
        employeeDto.setAddress(userInfo.getAddress());
        employeeDto.setStatus(userInfo.isStatus());
        employeeDto.setUsername(userInfo.getUsername());
        employeeDto.setPassword(userInfo.getPassword());
        employeeDto.setRoles(userInfo.getRoles().stream().map(Enum::toString).collect(Collectors.toSet()));
        return employeeDto;
    }
    
    @Override
    public List<Object[]> findStaffAndTotalPriceByRoleAndStatus(AccountRole role, RequestStatus status) {
        return userInfoRepository.findStaffAndTotalPriceByRoleAndStatus(role, status);
    }
    
    @Override
    public List<EmployeeDto> getAllEmployeeAndPagination(Pageable pageable) {
        return userInfoRepository.getAllByRolesIsNotContaining(AccountRole.ROLE_CUSTOMER, pageable).stream().map(
                this::convertEmployee
        ).collect(Collectors.toList());
    }
    
    @Override
    public EmployeeDto findById(Long employeeId) {
        return convertEmployee(userInfoRepository.findById(employeeId).orElseThrow(() -> new NotFoundEntityException("Employee not found")));
    }
    
    @Override
    public void updateEmployee(Long id, EmployeeDto updatedEmployee) {
        UserInfo existingEmployee = userInfoRepository.findById(id)
                .orElseThrow(() -> new NotFoundEntityException("Employee not found with id: " + id));
        
        UserInfo updatedUserInfo = convertEmployee(updatedEmployee);
        updatedUserInfo.setId(existingEmployee.getId());
        
        userInfoRepository.save(updatedUserInfo);
    }
    
    @Override
    public void updateEmployeeStatus(Long employeeId, boolean status) {
        UserInfo existingEmployee = userInfoRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundEntityException("Employee not found with id: " + employeeId));
        existingEmployee.setStatus(status);
        userInfoRepository.save(existingEmployee);
    }
    
    @Override
    public CustomerDto getCustomerInfoProfileByUsername(String username) {
        return convertCustomer(userInfoRepository.findByUsername(username).orElseThrow(() -> new NotFoundEntityException("Customer not found!")));
    }
    
    @Override
    public void updateCustomer(String username, CustomerDto customerDto) {
        UserInfo existingCustomer = userInfoRepository.findByUsername(username).orElseThrow(() -> new NotFoundEntityException("Customer not found!"));
        UserInfo updateCustomer = convertCustomer(customerDto);
        updateCustomer.setId(existingCustomer.getId());
        userInfoRepository.save(updateCustomer);
    }
    
    private String welcomeCustomerMessage(String fullName, String email, String phone) {
        return "<!DOCTYPE html>"
                + "<html lang=\"en\">"
                + "<head>"
                + "    <meta charset=\"UTF-8\">"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
                + "    <title>Welcome to Furniture Design</title>"
                + "    <style>"
                + "        body { font-family: Arial, sans-serif; }"
                + "        .email-container { max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; }"
                + "        .button { background-color: #bde2f6; color: white; padding: 10px 20px; text-align: center;"
                + "                  display: inline-block; border-radius: 5px; text-decoration: none; }"
                + "    </style>"
                + "</head>"
                + "<body>"
                + "<div class=\"email-container\">"
                + "    <h2>Welcome to Furniture Design!</h2>"
                + "    <p>Dear " + fullName + ",</p>"
                + "    <p>We're thrilled to have you with us. Your journey to exquisite interiors starts here. Below are your login details:</p>"
                + "    <ul>"
                + "        <li><strong>Username:</strong> " + email + "</li>"
                + "        <li><strong>Password:</strong> " + phone + "</li>"
                + "    </ul>"
                + "    <p>Please use these credentials to log in and start your project:</p>"
                + "    <a href=\"http://localhost:5173/login\" class=\"button\">Login to Your Account</a>"
                + "    <p>We're here to assist you every step of the way. Let's create something beautiful together!</p>"
                + "    <p>Warm regards,<br>The Furniture Design Team</p>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
    
}

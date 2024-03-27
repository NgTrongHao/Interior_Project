package swp.group5.swp_interior_project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.enums.AccountRole;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.util.List;
import java.util.UUID;

public interface RequestRepository extends JpaRepository<Request, UUID> {
    Page<Request> findByRequestStatusEmployee(RequestStatus status, Pageable pageable);
    
    Page<Request> findByCustomerUsername(String customerUsername, Pageable pageable);
    
    @Query("SELECT r.customer.username, SUM(DISTINCT r.price) " +
            "FROM Request r " +
            "JOIN r.versions v " +
            "JOIN v.statusHistories sh " +
            "JOIN sh.user u " +
            "WHERE :role MEMBER OF u.roles " +
            "AND r.requestStatusEmployee = :status " +
            "GROUP BY r.customer.username")
    List<Object[]> findStaffAndTotalPriceByRoleAndStatus(@Param("role") AccountRole role, @Param("status") RequestStatus status);
    
    @Query("SELECT r.id " +
            "FROM Request r " +
            "JOIN r.versions v " +
            "JOIN v.statusHistories sh " +
            "JOIN sh.user u " +
            "WHERE u.username = :username")
    List<UUID> findRequestListByUser(@Param("username") String username);
}

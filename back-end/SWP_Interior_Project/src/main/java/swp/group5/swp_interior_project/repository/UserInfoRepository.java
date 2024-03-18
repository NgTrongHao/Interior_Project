package swp.group5.swp_interior_project.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.UserInfo;
import swp.group5.swp_interior_project.model.enums.AccountRole;
import swp.group5.swp_interior_project.model.enums.RequestStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUsername(String username);
    
    boolean existsByEmailOrPhoneOrUsername(String email, String phone, String username);
    
    List<UserInfo> findByRolesContaining(AccountRole role);
    
    @Query("SELECT u.fullName, SUM(r.price) " +
            "FROM Request r " +
            "JOIN r.versions v " +
            "JOIN v.statusHistories sh " +
            "JOIN sh.user u " +
            "WHERE :role MEMBER OF u.roles " +
            "AND r.requestStatusEmployee = :status " +
            "AND sh.status = 'PROPOSAL_AWAITING_APPROVAL' " +
//            "AND MONTH(sh.dateTime) = MONTH(CURRENT_DATE()) - 1 " +
//            "AND YEAR(sh.dateTime) = YEAR(CURRENT_DATE()) " +
            "GROUP BY u.fullName")
    List<Object[]> findStaffAndTotalPriceByRoleAndStatus(@Param("role") AccountRole role, @Param("status") RequestStatus status);
    
    List<UserInfo> getAllByRolesIsNotContaining(AccountRole role, Pageable pageable);
}

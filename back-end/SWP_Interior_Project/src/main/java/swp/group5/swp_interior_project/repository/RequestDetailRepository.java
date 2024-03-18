package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import swp.group5.swp_interior_project.model.entity.RequestDetail;
import swp.group5.swp_interior_project.model.entity.RequestVersion;

import java.util.List;

public interface RequestDetailRepository extends JpaRepository<RequestDetail, Long> {
    void deleteAllByRequestVersion(RequestVersion last);
    
    List<RequestDetail> findByRequestVersion(RequestVersion requestVersion);
}

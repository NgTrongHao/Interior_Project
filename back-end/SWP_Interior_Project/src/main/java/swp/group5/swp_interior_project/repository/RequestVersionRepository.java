package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.Request;
import swp.group5.swp_interior_project.model.entity.RequestVersion;

import java.util.List;

@Repository
public interface RequestVersionRepository extends JpaRepository<RequestVersion, String> {
    List<RequestVersion> findByRequest(Request request);
}

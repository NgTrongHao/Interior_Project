package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.Workspace;

import java.util.Optional;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    Optional<Workspace> findByWorkspaceName(String workspaceName);
    boolean existsByWorkspaceName(String workspaceName);
}

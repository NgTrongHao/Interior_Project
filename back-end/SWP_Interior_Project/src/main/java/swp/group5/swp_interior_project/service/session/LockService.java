package swp.group5.swp_interior_project.service.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
public class LockService {
    
    public boolean isRequestLocked(HttpSession session, UUID requestId) {
        Set<UUID> lockedRequests = getLockedRequests(session);
        return lockedRequests.contains(requestId);
    }
    
    public synchronized void lockRequest(HttpSession session, UUID requestId) {
        Set<UUID> lockedRequests = getLockedRequests(session);
        lockedRequests.add(requestId);
        session.setAttribute("lockedRequests", lockedRequests);
    }
    
    public synchronized void unlockRequest(HttpSession session, UUID requestId) {
        Set<UUID> lockedRequests = getLockedRequests(session);
        lockedRequests.remove(requestId);
        session.setAttribute("lockedRequests", lockedRequests);
    }
    
    @SuppressWarnings("unchecked")
    private Set<UUID> getLockedRequests(HttpSession session) {
        Set<UUID> lockedRequests = (Set<UUID>) session.getAttribute("lockedRequests");
        if (lockedRequests == null) {
            lockedRequests = new HashSet<>();
        }
        return lockedRequests;
    }
}

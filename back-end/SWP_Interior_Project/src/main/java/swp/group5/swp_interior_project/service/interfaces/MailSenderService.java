package swp.group5.swp_interior_project.service.interfaces;

public interface MailSenderService {
    void sendMail(String to, String subject, String body);
}

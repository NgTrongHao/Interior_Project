package swp.group5.swp_interior_project.service.implement;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.service.interfaces.MailSenderService;

@Service
public class MailSenderServiceImpl implements MailSenderService {
    @Value("${spring.mail.username}")
    private String fromMail;
    
    private final JavaMailSender javaMailSender;
    
    @Autowired
    public MailSenderServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }
    
    @Override
    public void sendMail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(fromMail, "FurnitureDesign");
            mimeMessageHelper.setTo(to);
            mimeMessageHelper.setSubject(subject);
            mimeMessageHelper.setText("", body);
            
            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

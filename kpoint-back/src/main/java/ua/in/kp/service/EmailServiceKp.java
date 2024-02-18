package ua.in.kp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.repository.SubscriptionRepository;

import java.util.List;

@Slf4j
@Service
public class EmailServiceKp {
    private final JavaMailSender emailSender;
    private final UserService userService;
    private final Environment env;
    private final String sender;

    private final SubscriptionRepository subscriptionRepository;

    public EmailServiceKp(
            JavaMailSender emailSender,
            UserService userService,
            Environment env,
            @Value("${MAIL_USERNAME}") String sender, SubscriptionRepository subscriptionRepository) {
        this.emailSender = emailSender;
        this.userService = userService;
        this.env = env;
        this.sender = sender;
        this.subscriptionRepository = subscriptionRepository;
    }

    public void sendProjectSubscriptionMessage(String projectId) {

        UserEntity user = userService.getAuthenticated();
        try {
            sendSubscribeMail(user, projectId);
            log.info("User {} subscribed on project {}", user.getEmail(), projectId);
        } catch (Exception e) {
            log.warn("Email to {} was not sent {}", user.getEmail(), e.getMessage());
            throw new RuntimeException();
        }
    }

    private void sendSubscribeMail(UserEntity user, String projectId) {
        SimpleMailMessage message = new SimpleMailMessage();

        setMessageData(message, env.getProperty("email.subscription_mail.subject"),
                env.getProperty("email.subscription_mail.text") + "\n\n"
                        + "Лінк на проект: " + "http://localhost:3000/projects/" + projectId);
        message.setTo(user.getEmail());
        emailSender.send(message);
        log.info("Email to {} was sent", user.getEmail());
    }

    public void sendUpdateProjectMail(String projectId) {
        SimpleMailMessage message = new SimpleMailMessage();
        setMessageData(message, env.getProperty("email.update_project_mail.subject"),
                env.getProperty("email.update_project_mail.text") + "\n\n"
                        + "Лінк на проект: " + "http://localhost:3000/projects/" + projectId);

        List<String> usersMails = setUsersMailsList(projectId);
        for (String mail : usersMails) {
            log.info("EMAILS: " + mail);
            message.setTo(mail);
            emailSender.send(message);
            log.info("Email with updates was sent to {}", mail);
        }
    }

    public List<ProjectSubscribeEntity> getUsersSubscribedToProject(String projectId) {
        return subscriptionRepository.findByProjectId(projectId);
    }

    private List<String> setUsersMailsList(String projectId) {
        List<ProjectSubscribeEntity> subscriptions =
                getUsersSubscribedToProject(projectId);
        log.info("ПІДПИСНИКИ " + subscriptions.toString() + " List size " + subscriptions.size());

        return subscriptions.stream()
                .map(subscription -> userService.getById(subscription.getUserId()).getEmail())
                .toList();
    }

    private void setMessageData(SimpleMailMessage message, String subject, String text) {
        message.setFrom(sender);
        message.setSubject(subject);
        message.setText(text);
    }
}

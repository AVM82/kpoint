package ua.in.kp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.UserEntity;

import java.util.List;

@Slf4j
@Service
public class EmailServiceKp {
    private final JavaMailSender emailSender;
    private final UserService userService;
    private final Environment env;
    private final ProjectService projectService;
    private final String sender;

    public EmailServiceKp(
            JavaMailSender emailSender,
            UserService userService,
            Environment env,
            ProjectService projectService,
            @Value("${MAIL_USERNAME}") String sender) {
        this.emailSender = emailSender;
        this.userService = userService;
        this.env = env;
        this.projectService = projectService;
        this.sender = sender;
    }

    public String sendProjectSubscriptionMessage(String projectId) {

        UserEntity user = userService.getAuthenticated();
        try {
            sendSubscribeMail(user);
            projectService.subscribeUserToProject(user.getId(), projectId);
            return "Ви успішно підписалися на проект!";
        } catch (Exception e) {
            log.warn("Email to {} was not sent {}", user.getEmail(), e.getMessage());
            throw new RuntimeException();
        }
    }

    private void sendSubscribeMail(UserEntity user) {
        SimpleMailMessage message = new SimpleMailMessage();
        setMessageData(message, env.getProperty("email.subscription_mail.subject"),
                env.getProperty("email.subscription_mail.text"));
        message.setTo(user.getEmail());
        emailSender.send(message);
        log.info("Email to {} was sent", user.getEmail());
    }

    public void sendUpdateProjectMail(String projectId) {
        SimpleMailMessage message = new SimpleMailMessage();
        setMessageData(message, env.getProperty("email.update_project_mail.subject"),
                env.getProperty("email.update_project_mail.text"));

        List<String> usersMails = setUsersMailsList(projectId);
        for (String mail : usersMails) {
            log.info("EMAILS " + mail + usersMails.size());
            message.setTo(mail);
            emailSender.send(message);
            log.info("Email with updates was sent to {}", mail);
        }
    }

    private List<String> setUsersMailsList(String projectId) {
        List<ProjectSubscribeEntity> subscriptions =
                projectService.getUsersSubscribedToProject(projectId);
        log.info("ПІДПИСНИКИ " + subscriptions.toString() + subscriptions.size());

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

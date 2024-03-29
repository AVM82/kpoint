package ua.in.kp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.ProjectSubscribeEntity;
import ua.in.kp.entity.UserEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.repository.SubscriptionRepository;

import java.util.List;

@Slf4j
@Service
public class EmailServiceKp {
    private final JavaMailSender emailSender;
    private final UserService userService;
    private final Environment env;
    private final String sender;
    private final SpringTemplateEngine templateEngine;
    private final SubscriptionRepository subscriptionRepository;
    private final Translator translator;

    public EmailServiceKp(
            JavaMailSender emailSender,
            UserService userService,
            Environment env,
            @Value("${MAIL_USERNAME}") String sender, SpringTemplateEngine templateEngine,
            SubscriptionRepository subscriptionRepository, Translator translator) {
        this.emailSender = emailSender;
        this.userService = userService;
        this.env = env;
        this.sender = sender;
        this.templateEngine = templateEngine;
        this.subscriptionRepository = subscriptionRepository;
        this.translator = translator;
    }

    public void sendProjectSubscriptionMessage(ProjectEntity project, UserEntity user) {

        try {
            sendProjectSubscribeEmail(user, project);
            log.info("User {} subscribed on project {}", user.getEmail(), project.getTitle());
        } catch (Exception e) {
            log.warn("Email to {} was not sent {}", user.getEmail(), e.getMessage());
            throw new ApplicationException(HttpStatus.BAD_REQUEST, "Email to was not sent");
        }
    }

    public List<ProjectSubscribeEntity> getUsersSubscribedToProject(String projectId) {
        log.info("SUBSCRIBERS ");
        return subscriptionRepository.findByProjectProjectId(projectId);
    }

    private List<String> setUsersMailsList(String projectId) {
        List<ProjectSubscribeEntity> subscriptions =
                getUsersSubscribedToProject(projectId);
        log.info("ПІДПИСНИКИ " + subscriptions.toString() + " List size " + subscriptions.size());

        return subscriptions.stream()
                .map(subscription -> subscription.getUser().getEmail())
                .toList();
    }

    private void setMessageData(SimpleMailMessage message, String subject, String text) {
        message.setFrom(sender);
        message.setSubject(subject);
        message.setText(text);
    }

    public void sendUnsubscribeMessage(String email, String projectUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        setMessageData(message, env.getProperty("email.unsubscription_mail.subject"),
                env.getProperty("email.unsubscription_mail.text") + "\n\n"
                        + "Лінк на проєкт: " + env.getProperty("oauth2.redirect-uri") + "/projects/" + projectUrl);
        message.setTo(email);
        emailSender.send(message);
        log.info("Email to {} was sent", email);
    }

    public void sendProjectUpdateEmail(String projectId, List<String> changedFields, ProjectEntity project) {
        if (changedFields == null || changedFields.isEmpty()) {
            return;
        }
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        String htmlContent = getHtmlContent(projectId, changedFields, project);
        List<String> usersMails = setUsersMailsList(projectId);
        try {
            helper.setText(htmlContent, true);
            helper.setSubject("Project Update Notification");
            helper.setFrom(sender);
            for (String mail : usersMails) {
                log.info("EMAILS: " + mail);
                helper.setTo(mail);
                emailSender.send(message);
                log.info("Email with updates was sent to {}", mail);
            }
        } catch (MessagingException e) {
            log.error("Error sending email", e);
        }
    }

    private String getHtmlContent(String projectId, List<String> changedFields, ProjectEntity project) {
        Context context = new Context();
        context.setVariable("projectName", project.getTitle());
        context.setVariable("changedFields", changedFields);
        context.setVariable("website", env.getProperty("oauth2.redirect-uri"));
        context.setVariable("projectUrl",
                env.getProperty("oauth2.redirect-uri") + "/projects/" + project.getUrl());

        return templateEngine.process("updateProject-email", context);
    }

    private String getHtmlSubscribeContent(ProjectEntity project) {
        Context context = new Context();
        context.setVariable("projectName", project.getTitle());
        context.setVariable("website", env.getProperty("oauth2.redirect-uri"));
        context.setVariable("projectUrl",
                env.getProperty("oauth2.redirect-uri") + "/projects/" + project.getUrl());

        return templateEngine.process("subscribeProject-email", context);
    }

    public void sendProjectSubscribeEmail(UserEntity user, ProjectEntity project) {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
        String htmlContent = getHtmlSubscribeContent(project);
        try {
            helper.setText(htmlContent, true);
            helper.setSubject(translator.getLocaleMessage("email.subscribe.subject"));
            helper.setFrom(sender);
            helper.setTo(user.getEmail());
            emailSender.send(message);
            log.info("Email with updates was sent to {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Error sending email", e);
        }
    }
}

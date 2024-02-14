package ua.in.kp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import ua.in.kp.dto.subscribtion.SubscribeResponseDto;

@Slf4j
@Service
//@AllArgsConstructor
public class EmailServiceKp {

  private final JavaMailSender emailSender;

//  @Value("${MAIL_USERNAME}")
  private final String sender;

  public EmailServiceKp(JavaMailSender emailSender, @Value("${MAIL_USERNAME}")String sender) {
    this.emailSender = emailSender;
    this.sender = sender;
  }

  public SubscribeResponseDto sendProjectSubscriptionMessage(String projectId) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(sender);
//      message.setFrom("${spring.mail.username}");
//      message.setFrom("shpp_programming@zohomail.com");
      message.setTo("inna_burlaka@ukr.net");
      message.setSubject("Hi");
      message.setText("Message");
      emailSender.send(message);
      log.info("Email was sent");



      return new SubscribeResponseDto("Ви успішно підписалися на проект!");
    } catch (Exception e) {
      log.warn("Email to  was not sent {}", e.getMessage());
      throw new RuntimeException();
    }
  }
}

package ua.in.kp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Getter
@Setter
@Table(name = "suggestions")
public class SuggestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "suggestion_id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(columnDefinition = "VARCHAR(200)", nullable = false)
    private String suggestion;

    @Column(name = "like-count")
    private int likeCount = 0;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now(ZoneOffset.UTC);

}

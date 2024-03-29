package ua.in.kp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SoftDelete;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "suggestions")
@SoftDelete
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

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now(ZoneOffset.UTC);

    @OneToMany(mappedBy = "suggestion", cascade = CascadeType.REMOVE)
    private Set<LikeEntity> likes = new HashSet<>();

}

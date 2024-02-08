package ua.in.kp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.SoftDelete;
import org.springframework.format.annotation.DateTimeFormat;
import ua.in.kp.enumeration.ProjectState;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
@SoftDelete
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "project_id")
    private String projectId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity owner;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false, unique = true)
    private String title;

    @Column(columnDefinition = "VARCHAR(30)", nullable = false, unique = true)
    private String url;

    @Column(columnDefinition = "VARCHAR(150)", nullable = false)
    private String summary;

    @Column(columnDefinition = "VARCHAR(512)", nullable = false)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    private Set<TagEntity> tags;

    @Column(name = "logo_img_url", columnDefinition = "TEXT")
    private String logoImgUrl;

    @Column(columnDefinition = "DECIMAL(5,1)")
    private double latitude = 49.1;

    @Column(columnDefinition = "DECIMAL(5,1)")
    private double longitude = 32.5;

    @Column(name = "created_at")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now(ZoneOffset.UTC);

    @Enumerated(EnumType.STRING)
    private ProjectState state = ProjectState.NEW;

    @Column(name = "owner_sum")
    private int ownerSum;

    @Column(name = "collected_sum", columnDefinition = "INT DEFAULT 0")
    private int collectedSum;

    @Column(name = "start_sum")
    private int startSum;

    @Column(name = "collect_deadline")
    private LocalDate collectDeadline;

    @Column(name = "goal_sum")
    private int goalSum;

    @Column(name = "goal_deadline")
    private LocalDate goalDeadline;

    @ElementCollection(fetch = FetchType.LAZY)
    @Column(name = "networks_links")
    private Map<String, String> networksLinks;

}

package ua.in.kp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "project_subscription")
@SoftDelete
public class ProjectSubscribeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;

    private String projectId;
}

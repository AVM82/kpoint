package ua.in.kp.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class ProjectSubscriptionId implements Serializable {
    private String userId;
    private String projectId;
}

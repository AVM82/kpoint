package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.in.kp.entity.ProjectSubscribeEntity;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<ProjectSubscribeEntity, String> {

    List<ProjectSubscribeEntity> findByProjectId(String id);

}

package ua.in.kp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.TagEntity;

public interface TagRepository extends JpaRepository<TagEntity, String> {

    @Modifying
    @Query(value = "INSERT INTO tags_index (name) VALUES (:name) ON CONFLICT DO NOTHING",
            nativeQuery = true)
    void saveByNameIfNotExist(String name);
}

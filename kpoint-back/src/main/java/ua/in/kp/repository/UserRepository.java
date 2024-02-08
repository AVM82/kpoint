package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    @Query("FROM UserEntity u LEFT JOIN FETCH u.roles WHERE u.email=:email")
    Optional<UserEntity> findByEmailFetchRoles(String email);

    @EntityGraph(attributePaths = {"roles", "tags", "socialNetworks"})
    Optional<UserEntity> findByEmail(String email);

    @Query("FROM UserEntity u WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchNothing(String username);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"socialNetworks", "roles"})
    Page<UserEntity> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"tags", "projectsOwned", "projectsFavourite"})
    Optional<UserEntity> findByUsername(String username);

    @Query("FROM UserEntity u LEFT JOIN FETCH u.projectsOwned WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchProjectsOwned(String username);

    @Query("SELECT u.projectsFavourite FROM UserEntity u INNER JOIN u.projectsFavourite "
            + "WHERE u.username=:username")
    Page<ProjectEntity> findByUsernameFetchProjectsFavourite(String username, Pageable pageable);
}

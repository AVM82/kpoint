package ua.in.kp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    @Query("FROM UserEntity u LEFT JOIN FETCH u.roles WHERE u.email=:email")
    Optional<UserEntity> findByEmailFetchRoles(String email);

    @EntityGraph(attributePaths = {"roles", "tags", "socialNetworks"})
    Optional<UserEntity> findByEmail(String email);

    @Query("FROM UserEntity u WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchNothing(String username);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"socialNetworks", "roles"})
    Page<UserEntity> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM kpoint.public.users AS u "
            + "LEFT JOIN kpoint.public.user_roles AS r ON u.id = r.user_id", nativeQuery = true)
    Page<UserEntity> findAllByAdmin(Pageable pageable);

    @EntityGraph(attributePaths = {"tags", "projectsOwned", "projectsFavourite"})
    Optional<UserEntity> findByUsername(String username);

    @Query("FROM UserEntity u LEFT JOIN FETCH u.projectsOwned WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchProjectsOwned(String username);

    @Query("SELECT u.projectsFavourite FROM UserEntity u INNER JOIN u.projectsFavourite "
            + "WHERE u.username=:username")
    Page<ProjectEntity> findByUsernameFetchProjectsFavourite(String username, Pageable pageable);

    @Query(value = "SELECT * FROM kpoint.public.users AS u "
            + "WHERE u.id=:id", nativeQuery = true)
    Optional<UserEntity> findByIdByAdmin(@Param("id") String id);

    @Query("FROM UserEntity u LEFT JOIN FETCH u.tags LEFT JOIN FETCH u.socialNetworks "
            + "WHERE u.username=:username")
    Optional<UserEntity> findByUsernameFetchTagsSocials(String username);
}

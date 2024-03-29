package ua.in.kp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SoftDelete;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ua.in.kp.enumeration.SocialNetworkName;
import ua.in.kp.enumeration.UserRole;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@SoftDelete
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "username", columnDefinition = "VARCHAR(50)", nullable = false, unique = true)
    private String username;

    @Column(name = "password", columnDefinition = "VARCHAR(100)", nullable = false)
    private String password;

    @Column(name = "email", columnDefinition = "VARCHAR(100)", nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", columnDefinition = "VARCHAR(50)", nullable = false)
    private String firstName;

    @Column(name = "last_name", columnDefinition = "VARCHAR(50)", nullable = false)
    private String lastName;

    @Column(name = "avatar_img_url",
            columnDefinition = "VARCHAR(100)")
    private String avatarImgUrl;

    @Column(name = "description", columnDefinition = "VARCHAR(512)")
    private String description;

    @ManyToMany
    private Set<TagEntity> tags;

    @ElementCollection
    @CollectionTable(name = "user_socials", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyEnumerated
    @Column(name = "url")
    @SoftDelete
    private Map<SocialNetworkName, String> socialNetworks = new EnumMap<>(SocialNetworkName.class);

    @ElementCollection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @SoftDelete
    private Set<UserRole> roles = new HashSet<>();

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    private Set<ProjectEntity> projectsOwned;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
    private Set<SuggestionEntity> suggestions;

    @ManyToMany
    @SoftDelete
    private Set<ProjectEntity> projectsFavourite;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .toList();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserEntity that = (UserEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}

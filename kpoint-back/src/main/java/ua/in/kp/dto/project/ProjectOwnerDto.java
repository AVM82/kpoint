package ua.in.kp.dto.project;

import lombok.Data;

@Data
public class ProjectOwnerDto {
    private String ownerId;
    private String firstName;
    private String lastName;
    private String avatarImgUrl;
}

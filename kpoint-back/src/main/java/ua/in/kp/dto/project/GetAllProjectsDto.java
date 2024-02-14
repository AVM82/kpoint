package ua.in.kp.dto.project;

import lombok.Data;

import java.util.Set;

@Data
public class GetAllProjectsDto {

    private String url;

    private String title;

    private String summary;

    private Set<String> tags;

    private String logoImgUrl;
    private String state;
}

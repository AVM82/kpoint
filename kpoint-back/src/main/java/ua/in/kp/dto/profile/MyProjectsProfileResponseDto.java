package ua.in.kp.dto.profile;

import ua.in.kp.dto.project.GetAllProjectsDto;

import java.util.List;

public record MyProjectsProfileResponseDto(
        String userId,
        List<GetAllProjectsDto> myProjects
) {
}

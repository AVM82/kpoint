package ua.in.kp.dto.user;

import ua.in.kp.dto.project.GetAllProjectsDto;

import java.util.List;

public record PersonalProfileResponseDto(
        String userId,
        List<GetAllProjectsDto> myProjects,
        List<GetAllProjectsDto> favouriteProjects,
        List<GetAllProjectsDto> recommendedProjects
) {
}

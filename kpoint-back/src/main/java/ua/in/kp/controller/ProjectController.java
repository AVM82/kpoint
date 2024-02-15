package ua.in.kp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.service.EmailServiceKp;
import ua.in.kp.service.ProjectService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final EmailServiceKp emailService;

    @PostMapping()
    public ResponseEntity<ProjectResponseDto> createProject(
            @Valid @RequestBody ProjectCreateRequestDto createdProject) {
        return new ResponseEntity<>(projectService
                .createProject(createdProject), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<Page<GetAllProjectsDto>> getAllProjects(Pageable pageable) {
        return new ResponseEntity<>(projectService.getAllProjects(pageable), HttpStatus.OK);
    }

    @GetMapping("/id/{projectId}")
    public ResponseEntity<ProjectResponseDto> getProjectById(@PathVariable String projectId) {
        ProjectResponseDto projectDto = projectService.getProjectById(projectId);
        return new ResponseEntity<>(projectDto, HttpStatus.OK);
    }

    @GetMapping("/{url}")
    public ResponseEntity<ProjectResponseDto> getProjectByUrl(@PathVariable String url) {
        ProjectResponseDto projectDto = projectService.getProjectByUrl(url);
        return new ResponseEntity<>(projectDto, HttpStatus.OK);
    }

    @PostMapping("/{projectId}/subscribe")
    private ResponseEntity<String> subscribeToProject(@PathVariable String projectId) {
        return new ResponseEntity<>(emailService.sendProjectSubscriptionMessage(projectId), HttpStatus.OK);
    }
}

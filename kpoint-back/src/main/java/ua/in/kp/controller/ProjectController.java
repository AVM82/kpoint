package ua.in.kp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.in.kp.dto.project.GetAllProjectsDto;
import ua.in.kp.dto.project.ProjectCreateRequestDto;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.dto.subscribtion.SubscribeResponseDto;
import ua.in.kp.service.ProjectService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProjectResponseDto> createProject(
            @Valid @RequestPart ProjectCreateRequestDto createdProject,
            @RequestPart("file") MultipartFile file) {
        return new ResponseEntity<>(projectService
                .createProject(createdProject, file), HttpStatus.CREATED);
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

    @GetMapping("/{title}/title")
    public ResponseEntity<ProjectResponseDto> getProjectByTitle(@PathVariable String title) {
        ProjectResponseDto projectDto = projectService.getProjectByTitle(title);
        return new ResponseEntity<>(projectDto, HttpStatus.OK);
    }

    @PostMapping("/{projectId}/subscribe")
    public ResponseEntity<SubscribeResponseDto> subscribeToProject(@PathVariable String projectId) {
        return new ResponseEntity<>(projectService.subscribeUserToProject(projectId), HttpStatus.OK);
    }

    @PutMapping("/{projectId}/update")
    public ResponseEntity<ProjectResponseDto> updateProject(@PathVariable String projectId,
                                                            @Valid @RequestBody
                                                            ProjectCreateRequestDto createdProject) {
        return new ResponseEntity<>(projectService
                .updateProject(projectId, createdProject), HttpStatus.CREATED);
    }
}

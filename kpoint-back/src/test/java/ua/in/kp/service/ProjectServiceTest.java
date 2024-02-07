package ua.in.kp.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.exception.ProjectNotFoundException;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMapper projectMapper;
    @InjectMocks
    private ProjectService projectService;

    @Test
    void getAllProjectsTest() {
        Pageable pageable = Mockito.mock(Pageable.class);
        Page<ProjectEntity> page = Mockito.mock(Page.class);
        when(projectRepository.findAll(pageable)).thenReturn(page);
        projectService.getAllProjects(pageable);
        verify(projectRepository, times(1)).findAll(pageable);
        verify(page, times(1)).map(any());
    }

    @Test
    void getProjectById_shouldReturnProjectDto_whenProjectExists() {
        String projectId = "id";
        ProjectEntity mockProjectEntity = new ProjectEntity();
        ProjectResponseDto mockProjectDto = new ProjectResponseDto();

        when(projectRepository.findBy(projectId)).thenReturn(Optional.of(mockProjectEntity));
        when(projectMapper.toDto(mockProjectEntity)).thenReturn(mockProjectDto);

        ProjectResponseDto resultDto = projectService.getProjectById(projectId);

        assertNotNull(resultDto);
        assertEquals(mockProjectDto, resultDto);
        verify(projectRepository).findBy(projectId);
        verify(projectMapper).toDto(mockProjectEntity);
    }

    @Test
    void getProjectById_shouldThrowException_whenProjectDoesNotExist() {
        String projectId = "id";

        when(projectRepository.findBy(projectId)).thenReturn(Optional.empty());

        assertThrows(ProjectNotFoundException.class, () -> {
            projectService.getProjectById(projectId);
        });

        verify(projectRepository).findBy(projectId);
        verify(projectMapper, never()).toDto(any());
    }

    @Test
    void getProjectByURL_shouldReturnProjectDto_whenProjectExists() {
        String projectURL = "url123";
        ProjectEntity projectEntity = new ProjectEntity();
        ProjectResponseDto projectResponseDto = new ProjectResponseDto();

        when(projectRepository.findByProjectURL(projectURL)).thenReturn(Optional.of(projectEntity));
        when(projectMapper.toDto(projectEntity)).thenReturn(projectResponseDto);

        assertEquals(projectResponseDto, projectService.getProjectByURL(projectURL));
        verify(projectRepository).findByProjectURL(projectURL);
        verify(projectMapper).toDto(projectEntity);
    }

    @Test
    void getProjectByURL_shouldThrowException_whenProjectDoesNotExist() {
        String projectURL = "url123";

        assertThrows(ProjectNotFoundException.class, () -> {
            projectService.getProjectByURL(projectURL);
        });
        verify(projectRepository).findByProjectURL(projectURL);
    }
}

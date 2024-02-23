package ua.in.kp.service;

import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ua.in.kp.dto.project.ProjectResponseDto;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.locale.Translator;
import ua.in.kp.mapper.ProjectMapper;
import ua.in.kp.repository.ProjectRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock
    private Translator translator;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMapper projectMapper;
    @Mock
    private MeterRegistry meterRegistry;
    @Mock
    private Authentication auth;
    @InjectMocks
    private ProjectService projectService;

    @Test
    void getAllProjectsTest() {
        Pageable pageable = mock(Pageable.class);
        Page<ProjectEntity> page = mock(Page.class);
        when(projectRepository.findAll(pageable)).thenReturn(page);
        projectService.getAllProjects(pageable, auth);
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

        assertThrows(ApplicationException.class, () -> projectService.getProjectById(projectId));

        verify(projectRepository).findBy(projectId);
        verify(projectMapper, never()).toDto(any());
    }

    @Test
    void getProjectByUrl_shouldReturnProjectDto_whenProjectExists() {
        String projectUrl = "url123";
        ProjectEntity projectEntity = new ProjectEntity();
        ProjectResponseDto projectResponseDto = new ProjectResponseDto();

        when(projectRepository.findByProjectUrl(projectUrl)).thenReturn(Optional.of(projectEntity));
        when(projectMapper.toDto(projectEntity)).thenReturn(projectResponseDto);

        assertEquals(projectResponseDto, projectService.getProjectByUrl(projectUrl));
        verify(projectRepository).findByProjectUrl(projectUrl);
        verify(projectMapper).toDto(projectEntity);
    }

    @Test
    void getProjectByUrl_shouldThrowException_whenProjectDoesNotExist() {
        String projectUrl = "url123";

        assertThrows(ApplicationException.class, () -> projectService.getProjectByUrl(projectUrl));
        verify(projectRepository).findByProjectUrl(projectUrl);
    }
}

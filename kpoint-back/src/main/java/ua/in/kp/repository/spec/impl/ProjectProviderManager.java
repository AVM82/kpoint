package ua.in.kp.repository.spec.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import ua.in.kp.entity.ProjectEntity;
import ua.in.kp.exception.ApplicationException;
import ua.in.kp.repository.spec.SpecProvider;
import ua.in.kp.repository.spec.SpecProviderManager;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectProviderManager implements SpecProviderManager<ProjectEntity> {
    private final Set<SpecProvider<ProjectEntity>> projectSpecs;

    @Override
    public SpecProvider<ProjectEntity> getProvider(String key) {
        log.info("get project provider with key {}", key);
        return projectSpecs.stream()
                .filter(spec -> spec.getName().equals(key))
                .findFirst()
                .orElseThrow(() -> {
                    log.warn("There is no spec with name {}", key);
                    return new ApplicationException(HttpStatus.BAD_REQUEST, "There is no spec with name " + key);
                });
    }
}

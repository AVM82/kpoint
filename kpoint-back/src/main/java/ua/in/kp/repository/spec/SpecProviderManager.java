package ua.in.kp.repository.spec;

public interface SpecProviderManager<T> {
    SpecProvider<T> getProvider(String key);
}

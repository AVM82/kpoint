package ua.in.kp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;

@Configuration
public class S3Config {
    public static final String ACCESS_KEY = "YOUR_ACCESS_KEY";
    public static final String SECRET_KEY = "YOUR_SECRET_KEY";
    public static final Region REGION = Region.US_EAST_1;

    @Bean
    public S3Client s3Client() {
        AwsCredentials credentials = AwsBasicCredentials.create(ACCESS_KEY, SECRET_KEY);
        return S3Client.builder()
                .region(REGION)
                .credentialsProvider(() -> credentials)
                .build();
    }
}

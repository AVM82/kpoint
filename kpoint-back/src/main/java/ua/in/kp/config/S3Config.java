package ua.in.kp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.regions.Region;

@Configuration
public class S3Config {
    @Value("${aws.accessKeyId}")
    private String accessKeyId;
    @Value("${aws.secretKey}")
    private String secretKey;
    public static final Region REGION = Region.EU_NORTH_1;

    @Bean
    public S3Client s3Client() {
        AwsCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretKey);
        return S3Client.builder()
                .region(REGION)
                .credentialsProvider(() -> credentials)
                .build();
    }
}

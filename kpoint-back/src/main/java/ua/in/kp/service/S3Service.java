package ua.in.kp.service;

import lombok.AllArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@AllArgsConstructor
@Service
public class S3Service {
    private final S3Client s3Client;
    public static final int WIDTH = 240;
    public static final int HEIGHT = 240;

    public String uploadLogo(MultipartFile file)  {
       try {
           byte[] logoBytes = compressImage(file);

        String logoImgUrl = file.getOriginalFilename();
        s3Client.putObject(PutObjectRequest.builder()
                .bucket("your-s3-bucket-name")
                .key(logoImgUrl)
                .build(), RequestBody.fromBytes(logoBytes));

        return "https://your-s3-bucket-url/" + logoImgUrl;
       }catch (Exception e){
           return e.getMessage();
       }
    }

    private byte[] compressImage(MultipartFile file) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(file.getBytes()))
                .size(WIDTH, HEIGHT)
                .outputFormat("jpg")
                .toOutputStream(outputStream);
        return outputStream.toByteArray();
    }
}

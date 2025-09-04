package com.mynexjob.service;

import com.mynexjob.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("CareerBlast - Verify Your Email Address");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + user.getEmailVerificationToken();
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Welcome to CareerBlast! Please click the link below to verify your email address:\n\n" +
                "%s\n\n" +
                "If you didn't create an account with us, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The CareerBlast Team",
                user.getFirstName(),
                verificationUrl
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
        }
    }

    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("CareerBlast - Password Reset Request");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The CareerBlast Team",
                user.getFirstName(),
                resetUrl
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to CareerBlast!");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Welcome to CareerBlast! Your email has been verified successfully.\n\n" +
                "You can now:\n" +
                "- Browse thousands of job opportunities\n" +
                "- Create your professional profile\n" +
                "- Apply to jobs that match your skills\n" +
                "- Save jobs for later\n\n" +
                "Start your career journey today: %s\n\n" +
                "Best regards,\n" +
                "The CareerBlast Team",
                user.getFirstName(),
                frontendUrl
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }
}

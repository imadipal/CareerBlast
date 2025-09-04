package com.mynexjob.entity;

import com.mynexjob.enums.UserRole;
import lombok.*;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "users")
@CompoundIndex(name = "role_active_idx", def = "{'role': 1, 'isActive': 1}")
@CompoundIndex(name = "email_active_idx", def = "{'email': 1, 'isActive': 1}")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails {

    @Indexed(unique = true)
    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private String phone;

    private UserRole role;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isEmailVerified = false;

    private String emailVerificationToken;
    private String passwordResetToken;
    private LocalDateTime passwordResetExpiresAt;
    private LocalDateTime lastLoginAt;
    private String profilePictureUrl;
    private String avatarFileKey; // S3 file key for avatar
    private String bio;
    private String location;
    private String websiteUrl;
    private String linkedinUrl;
    private String githubUrl;

    // Spring Security UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && isEmailVerified;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    // For MongoDB relationships - we'll need to fetch profile separately
    public UserProfile getUserProfile() {
        // This will be handled in the service layer
        return null;
    }

    public void updateLastLoginTime() {
        // For now, we'll handle this in the service layer
        // this.lastLoginTime = LocalDateTime.now();
    }
}

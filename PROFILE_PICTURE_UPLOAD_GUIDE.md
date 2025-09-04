# Profile Picture Upload Implementation Guide

## 🎯 Overview

This guide covers the complete implementation of profile picture upload functionality using AWS S3 with presigned URLs for secure, direct-to-cloud uploads.

## 🏗️ Architecture

### Backend (Spring Boot)
- **S3Service**: Extended with avatar upload methods
- **ProfileController**: RESTful endpoints for avatar management
- **User Entity**: Extended with avatar file key storage
- **DTOs**: Request/Response objects for avatar operations

### Frontend (React + TypeScript)
- **avatarAPI**: Service layer for S3 integration
- **useAvatar**: React hook for avatar state management
- **AvatarUpload**: Reusable component with drag-and-drop
- **ProfilePictureSection**: Complete profile section component

## 🔧 Backend Implementation

### 1. S3Service Extensions

```java
// Generate presigned URL for avatar upload
public PresignedUploadResponse generateAvatarUploadUrl(
    String userId, String fileName, String fileExtension, long fileSize
) {
    // Validates image file types (jpg, jpeg, png, webp)
    // Enforces 5MB size limit
    // Returns presigned URL for direct S3 upload
}
```

### 2. ProfileController Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profile/avatar/upload-url` | Generate presigned upload URL |
| POST | `/profile/avatar/upload-complete` | Confirm upload completion |
| GET | `/profile/avatar/info` | Get avatar information |
| GET | `/profile/avatar/download-url` | Generate download URL |
| DELETE | `/profile/avatar/delete` | Delete avatar |

### 3. User Entity Extension

```java
@Document(collection = "users")
public class User extends BaseEntity implements UserDetails {
    // ... existing fields
    private String profilePictureUrl;  // Public URL for avatar
    private String avatarFileKey;      // S3 file key for management
}
```

## 🎨 Frontend Implementation

### 1. Avatar API Service

```typescript
import { avatarAPI } from '../services/avatarAPI';

// Complete upload process
await avatarAPI.uploadAvatar(file, (progress) => {
    console.log(`Upload progress: ${progress}%`);
});

// Get avatar information
const avatarInfo = await avatarAPI.getAvatarInfo();

// Delete avatar
await avatarAPI.deleteAvatar();
```

### 2. useAvatar Hook

```typescript
import { useAvatar } from '../hooks/useAvatar';

const MyComponent = () => {
    const {
        avatarInfo,
        isUploading,
        uploadProgress,
        hasAvatar,
        uploadAvatar,
        deleteAvatar,
        error
    } = useAvatar();

    // Hook automatically loads avatar info on mount
    // Provides all necessary state and actions
};
```

### 3. AvatarUpload Component

```typescript
import AvatarUpload from '../components/profile/AvatarUpload';

<AvatarUpload
    size="lg"                    // sm, md, lg, xl
    showUploadButton={true}
    showDeleteButton={true}
    onUploadSuccess={() => console.log('Success!')}
    onUploadError={(error) => console.error(error)}
/>
```

## 🔒 Security Features

### File Validation
- **Size Limit**: 5MB maximum
- **File Types**: JPG, JPEG, PNG, WebP only
- **Content Type**: Validated on both frontend and backend

### S3 Security
- **Presigned URLs**: Temporary, secure upload URLs (1 hour expiry)
- **Direct Upload**: Files go directly to S3, not through backend
- **Access Control**: User-specific file paths in S3

### Authentication
- **JWT Required**: All endpoints require valid authentication
- **User Isolation**: Users can only manage their own avatars

## 📱 User Experience

### Upload Flow
1. **File Selection**: Drag-and-drop or click to select
2. **Validation**: Instant feedback on file type/size
3. **Preview**: Show selected image before upload
4. **Progress**: Real-time upload progress bar
5. **Confirmation**: Success/error feedback

### Features
- ✅ **Drag and Drop**: Modern file selection interface
- ✅ **Progress Tracking**: Real-time upload progress
- ✅ **Image Preview**: Show avatar before and after upload
- ✅ **Error Handling**: Clear error messages and recovery
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Usage Examples

### Basic Avatar Upload

```typescript
import AvatarUpload from '../components/profile/AvatarUpload';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <h1>My Profile</h1>
            <AvatarUpload
                size="xl"
                onUploadSuccess={() => {
                    // Show success notification
                    toast.success('Profile picture updated!');
                }}
                onUploadError={(error) => {
                    // Show error notification
                    toast.error(`Upload failed: ${error}`);
                }}
            />
        </div>
    );
};
```

### Complete Profile Section

```typescript
import ProfilePictureSection from '../components/profile/ProfilePictureSection';

const EditProfilePage = () => {
    return (
        <div className="edit-profile">
            <ProfilePictureSection className="mb-6" />
            {/* Other profile sections */}
        </div>
    );
};
```

### Custom Avatar Display

```typescript
import { useAvatar } from '../hooks/useAvatar';

const UserCard = () => {
    const { avatarInfo, getAvatarUrl } = useAvatar();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (avatarInfo) {
            getAvatarUrl().then(setAvatarUrl);
        }
    }, [avatarInfo, getAvatarUrl]);

    return (
        <div className="user-card">
            {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="avatar" />
            ) : (
                <div className="avatar-placeholder">
                    <UserIcon />
                </div>
            )}
        </div>
    );
};
```

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_REGION=ap-south-1

# Frontend (.env)
VITE_API_URL=https://your-api-domain.com/api/v1
```

### S3 Bucket Configuration

```yaml
# application.yml
app:
  aws:
    s3:
      bucket-name: ${AWS_S3_BUCKET_NAME}
      region: ${AWS_S3_REGION}
      max-file-size: 5242880  # 5MB
      allowed-file-types: jpg,jpeg,png,webp
      presigned-url-expiration: 3600  # 1 hour
```

## 🧪 Testing

### Frontend Testing

```typescript
// Test avatar upload
const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
const { uploadAvatar } = useAvatar();

await uploadAvatar(file);
expect(/* avatar uploaded successfully */).toBeTruthy();
```

### Backend Testing

```java
@Test
public void testAvatarUpload() {
    // Test presigned URL generation
    // Test file validation
    // Test upload confirmation
}
```

## 🚨 Error Handling

### Common Errors
- **File too large**: Clear message with size limit
- **Invalid file type**: List of supported formats
- **Network errors**: Retry mechanism and user guidance
- **S3 errors**: Graceful fallback and error reporting

### Error Recovery
- **Automatic retry**: For network-related failures
- **Clear messaging**: User-friendly error descriptions
- **Fallback options**: Alternative upload methods if needed

## 📊 Monitoring

### Metrics to Track
- Upload success/failure rates
- Average upload time
- File size distribution
- Error types and frequency

### Logging
- Upload attempts and outcomes
- File validation failures
- S3 operation results
- User actions and errors

## 🔄 Future Enhancements

### Planned Features
- **Image Cropping**: Allow users to crop images before upload
- **Multiple Formats**: Support for additional image formats
- **Compression**: Automatic image optimization
- **CDN Integration**: Faster image delivery
- **Bulk Operations**: Upload multiple images at once

### Performance Optimizations
- **Image Resizing**: Server-side image processing
- **Caching**: Aggressive caching of avatar URLs
- **Lazy Loading**: Load avatars only when needed
- **Progressive Upload**: Chunked upload for large files

---

## 📝 Summary

The profile picture upload system provides:

✅ **Secure S3 Integration** with presigned URLs  
✅ **Complete Frontend Components** with modern UX  
✅ **Comprehensive Error Handling** and validation  
✅ **Real-time Progress Tracking** and feedback  
✅ **Responsive Design** for all devices  
✅ **Production-ready Security** and authentication  

Users can now upload, manage, and display profile pictures with a professional, secure, and user-friendly experience!

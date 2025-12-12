
## Troubleshooting & Fixes (Session 3)
During the final verification phase, several critical issues were identified and resolved to ensure end-to-end functionality.

### 1. Backend Compilation Errors
- **Issue**: `modules/user` and `modules/attendance` failed to compile due to missing Spring Security classes (`AuthenticationPrincipal`, `SecurityFilterChain`, etc.).
- **Fix**: Added `implementation 'org.springframework.boot:spring-boot-starter-security'` to the `build.gradle` of both modules to ensure the library is available on the compilation classpath.

### 2. API Connectivity ("Network Error")
- **Issue**: Frontend was receiving "Network Error" when calling the backend.
- **Root Cause**: URL mismatch. The backend controller maps to `/api/auth`, but the client was configured with base URL `http://localhost:8080/` and requested `/auth/login` (resulting in 404/CORS failure).
- **Fix**: Updated `frontend/src/shared/api/client.ts` to set `baseURL` to `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'`.

### 3. Login Failure (500 Internal Server Error)
- **Issue 1 (Data)**: The `admin@samsung.com` user was missing or had an invalid password hash in the database.
- **Fix 1**: Generated a valid BCrypt hash (`$2b$12$...`) using a pure Python script in a Docker container and updated `init.sql`. Performed a full data wipe (`rm -rf data`) to force re-initialization.
- **Issue 2 (Frontend)**: The `LoginForm.tsx` was sending `{ passwordHash: "..." }` instead of `{ password: "..." }`. This caused `request.getPassword()` to be null in the backend, throwing `IllegalArgumentException: rawPassword cannot be null`.
- **Fix 2**: Corrected `LoginForm.tsx` to send the correct JSON payload matching the backend `LoginRequest` DTO.

### 4. Cache & Updates
- **Issue**: Frontend code changes were not immediately picked up by the running container.
- **Fix**: Cleared `.next` cache and restarted the frontend container to force a rebuild.

The system is now fully integrated, with verified data flow from Frontend -> Backend -> Database and back.

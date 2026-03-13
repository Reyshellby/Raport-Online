# TODO: Fix Student Data Retrieval by Class in Teacher Score Input

## Plan
1. ✅ Add `students` relationship in `classes.php` model
2. ✅ Add `getStudentsByClass` method in `ClassesController.php`
3. ✅ Add route `GET /teacher/getStudentsByClass/{id}` in `api.php` (teacher middleware)
4. ✅ Update `TeacherScoresPage.jsx` to use the new endpoint

## Status: Completed ✓
- [x] Add students relationship in classes.php model
- [x] Add getStudentsByClass method in ClassesController.php
- [x] Add route in api.php (under teacher middleware)
- [x] Update TeacherScoresPage.jsx


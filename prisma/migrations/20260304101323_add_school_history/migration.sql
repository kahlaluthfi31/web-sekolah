-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('superadmin', 'admin', 'user') NOT NULL DEFAULT 'user',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `avatar` VARCHAR(255) NULL,
    `last_seen_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `menu_keys` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_permissions_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `virtual_tour_scenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scene_key` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `image_path` VARCHAR(500) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_default` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `virtual_tour_scenes_scene_key_key`(`scene_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `virtual_tour_hotspots` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scene_id` INTEGER NOT NULL,
    `pitch` DOUBLE NOT NULL,
    `yaw` DOUBLE NOT NULL,
    `text` VARCHAR(255) NOT NULL,
    `target_scene_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_verifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `verification_type` ENUM('email', 'nisn', 'ijazah') NOT NULL,
    `verificationData` TEXT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `verified_by` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `main_hero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `subtitle` TEXT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `video_url` VARCHAR(255) NULL,
    `button_text` VARCHAR(100) NULL,
    `button_url` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `principal_greetings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `content` TEXT NULL,
    `principal_name` VARCHAR(255) NULL,
    `principal_photo` VARCHAR(255) NULL,
    `signature` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `section` ENUM('sejarah', 'visi_misi', 'keunggulan') NOT NULL,
    `title` VARCHAR(255) NULL,
    `content` TEXT NULL,
    `video_url` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` VARCHAR(20) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `majors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `head_of_major` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `icon` VARCHAR(255) NULL,
    `detail_type` ENUM('PAGE', 'EXTERNAL') NOT NULL DEFAULT 'PAGE',
    `external_url` VARCHAR(500) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `majors_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `major_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `major_id` INTEGER NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `major_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `detail_type` ENUM('PAGE', 'EXTERNAL') NOT NULL DEFAULT 'PAGE',
    `external_url` VARCHAR(500) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `competency_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `competency_id` INTEGER NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(50) NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `photo` VARCHAR(255) NULL,
    `position` VARCHAR(255) NULL,
    `education` VARCHAR(255) NULL,
    `subjects` TEXT NULL,
    `status` ENUM('ACTIVE', 'RETIRED', 'RESIGNED', 'TRANSFERRED') NOT NULL DEFAULT 'ACTIVE',
    `join_date` DATETIME(3) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_structure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position_name` VARCHAR(255) NOT NULL,
    `teacher_id` INTEGER NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `principal_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `role` ENUM('KEPALA_SEKOLAH', 'WAKIL_KEPALA_SEKOLAH') NOT NULL,
    `start_year` INTEGER NOT NULL,
    `end_year` INTEGER NULL,
    `note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `positions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(255) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `condition` ENUM('baik', 'rusak', 'perlu_perbaikan') NOT NULL DEFAULT 'baik',
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_category_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `color` VARCHAR(100) NOT NULL DEFAULT 'bg-gray-100 text-gray-600',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `facility_category_configs_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `featured_image` VARCHAR(255) NULL,
    `category` ENUM('berita', 'kejuaraan', 'pengumuman', 'event') NOT NULL,
    `author_id` INTEGER NULL,
    `creator_name` VARCHAR(255) NULL,
    `creator_category` VARCHAR(100) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `tag_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_achievements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_name` VARCHAR(255) NOT NULL,
    `class` VARCHAR(50) NULL,
    `achievement_name` VARCHAR(255) NOT NULL,
    `competition_name` VARCHAR(255) NULL,
    `level` VARCHAR(100) NOT NULL DEFAULT 'sekolah',
    `position` VARCHAR(50) NULL,
    `year` YEAR NULL,
    `competition_date` DATE NULL,
    `photo` VARCHAR(255) NULL,
    `certificate_image` VARCHAR(255) NULL,
    `verified_by` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eskul_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `coach_name` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `eskul_data_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eskul_activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eskul_id` INTEGER NOT NULL,
    `activity_title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `activity_date` DATE NOT NULL,
    `image` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extracurriculars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `activity_title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `activity_date` DATE NULL,
    `time_start` VARCHAR(10) NULL,
    `time_end` VARCHAR(10) NULL,
    `coach_name` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `extracurricular_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `extracurricular_id` INTEGER NOT NULL,
    `student_name` VARCHAR(255) NOT NULL,
    `class` VARCHAR(50) NULL,
    `position` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agenda_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `color` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `agenda_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agendas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `event_date` DATE NULL,
    `event_time` TIME NULL,
    `time_end` TIME NULL,
    `time_end_text` VARCHAR(50) NULL,
    `location` VARCHAR(255) NULL,
    `organizer` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `status` ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    `is_published` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `virtual_tour_locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `virtual_tour_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location_id` INTEGER NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `panorama_data` TEXT NULL,
    `hotspot_info` TEXT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alumni_name` VARCHAR(255) NOT NULL,
    `graduation_year` YEAR NULL,
    `major` VARCHAR(255) NULL,
    `current_occupation` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `story` TEXT NULL,
    `photo` VARCHAR(255) NULL,
    `nisn` VARCHAR(50) NULL,
    `diploma_photo` VARCHAR(255) NULL,
    `submitted_by` INTEGER NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `verified_by` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submission_id` INTEGER NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `featured` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `alumni_profiles_submission_id_key`(`submission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content_type` ENUM('news', 'achievement', 'agenda', 'facility') NOT NULL,
    `content_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `comment_text` TEXT NOT NULL,
    `parent_id` INTEGER NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `approved_by` INTEGER NULL,
    `approved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment_likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `important_notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `notice_type` ENUM('ppdb', 'pengumuman', 'info_penting') NOT NULL,
    `priority` ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
    `display_until` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_regulations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NULL,
    `document_file` VARCHAR(255) NULL,
    `category` ENUM('siswa', 'guru', 'umum') NOT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `logo_url` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `info_type` ENUM('address', 'phone', 'email', 'social_media') NOT NULL,
    `label` VARCHAR(255) NULL,
    `value` VARCHAR(255) NULL,
    `icon` VARCHAR(255) NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NULL,
    `message` TEXT NOT NULL,
    `phone` VARCHAR(20) NULL,
    `status` ENUM('unread', 'read', 'replied') NOT NULL DEFAULT 'unread',
    `admin_reply` TEXT NULL,
    `replied_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `setting_key` VARCHAR(255) NOT NULL,
    `setting_value` TEXT NULL,
    `setting_type` ENUM('text', 'image', 'url', 'boolean') NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `website_settings_setting_key_key`(`setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `navigation_menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(255) NOT NULL,
    `menu_url` VARCHAR(255) NULL,
    `parent_id` INTEGER NULL,
    `menu_type` ENUM('internal', 'external', 'dropdown') NOT NULL,
    `order_position` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_permissions` ADD CONSTRAINT `admin_permissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `virtual_tour_hotspots` ADD CONSTRAINT `virtual_tour_hotspots_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `virtual_tour_scenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_verifications` ADD CONSTRAINT `user_verifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_verifications` ADD CONSTRAINT `user_verifications_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `major_gallery` ADD CONSTRAINT `major_gallery_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competencies` ADD CONSTRAINT `competencies_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `competency_gallery` ADD CONSTRAINT `competency_gallery_competency_id_fkey` FOREIGN KEY (`competency_id`) REFERENCES `competencies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_structure` ADD CONSTRAINT `school_structure_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `principal_histories` ADD CONSTRAINT `principal_histories_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_tags` ADD CONSTRAINT `news_tags_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_achievements` ADD CONSTRAINT `student_achievements_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eskul_activities` ADD CONSTRAINT `eskul_activities_eskul_id_fkey` FOREIGN KEY (`eskul_id`) REFERENCES `eskul_data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agendas` ADD CONSTRAINT `agendas_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `agenda_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `virtual_tour_images` ADD CONSTRAINT `virtual_tour_images_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `virtual_tour_locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_submissions` ADD CONSTRAINT `alumni_submissions_submitted_by_fkey` FOREIGN KEY (`submitted_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_submissions` ADD CONSTRAINT `alumni_submissions_verified_by_fkey` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_profiles` ADD CONSTRAINT `alumni_profiles_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `alumni_submissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_likes` ADD CONSTRAINT `comment_likes_comment_id_fkey` FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment_likes` ADD CONSTRAINT `comment_likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

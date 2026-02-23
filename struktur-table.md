-- Users
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
role ENUM('superadmin', 'admin', 'user') DEFAULT 'user',
status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
avatar VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Verification
CREATE TABLE user_verifications (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
verification_type ENUM('email', 'nisn', 'ijazah'),
verification_data TEXT,
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
verified_by INT,
verified_at TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Main Hero Section
CREATE TABLE main_hero (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255),
subtitle TEXT,
description TEXT,
image VARCHAR(255),
video_url VARCHAR(255),
button_text VARCHAR(100),
button_url VARCHAR(255),
order_position INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sambutan Kepsek
CREATE TABLE principal_greetings (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255),
content TEXT,
principal_name VARCHAR(255),
principal_photo VARCHAR(255),
signature VARCHAR(255),
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile Sekolah
CREATE TABLE school_profile (
id INT PRIMARY KEY AUTO_INCREMENT,
section ENUM('sejarah', 'visi_misi', 'keunggulan'),
title VARCHAR(255),
content TEXT,
video_url VARCHAR(255),
image VARCHAR(255),
order_position INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jurusan/Program Keahlian
CREATE TABLE majors (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
code VARCHAR(50) UNIQUE,
description TEXT,
head_of_major VARCHAR(255),
image VARCHAR(255),
icon VARCHAR(255),
order_position INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kompetensi Keahlian per Jurusan
CREATE TABLE competencies (
id INT PRIMARY KEY AUTO_INCREMENT,
major_id INT,
name VARCHAR(255) NOT NULL,
description TEXT,
FOREIGN KEY (major_id) REFERENCES majors(id)
);

-- Data Guru (aman, hanya nama dan foto)
CREATE TABLE teachers (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
photo VARCHAR(255),
position VARCHAR(255),
order_position INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Struktur Organisasi Sekolah
CREATE TABLE school_structure (
id INT PRIMARY KEY AUTO_INCREMENT,
position_name VARCHAR(255) NOT NULL,
teacher_id INT,
order_position INT DEFAULT 0,
FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE facilities (
id INT PRIMARY KEY AUTO_INCREMENT,
category ENUM('gedung', 'kelas', 'lab', 'perpustakaan', 'olahraga', 'lainnya'),
name VARCHAR(255) NOT NULL,
description TEXT,
image VARCHAR(255),
quantity INT DEFAULT 1,
condition ENUM('baik', 'rusak', 'perlu_perbaikan'),
order_position INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE,
excerpt TEXT,
content LONGTEXT,
featured_image VARCHAR(255),
category ENUM('berita', 'kejuaraan', 'pengumuman', 'event'),
author_id INT,
views INT DEFAULT 0,
is_published BOOLEAN DEFAULT FALSE,
published_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Tags untuk berita
CREATE TABLE news_tags (
id INT PRIMARY KEY AUTO_INCREMENT,
news_id INT,
tag_name VARCHAR(100),
FOREIGN KEY (news_id) REFERENCES news(id)
);

CREATE TABLE student_achievements (
id INT PRIMARY KEY AUTO_INCREMENT,
student_name VARCHAR(255) NOT NULL,
class VARCHAR(50),
achievement_name VARCHAR(255) NOT NULL,
competition_name VARCHAR(255),
level ENUM('sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional'),
position VARCHAR(50),
year YEAR,
certificate_image VARCHAR(255),
verified_by INT,
verified_at TIMESTAMP,
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE TABLE extracurriculars (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
description TEXT,
schedule VARCHAR(255),
coach_name VARCHAR(255),
image VARCHAR(255),
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anggota Ekstrakurikuler
CREATE TABLE extracurricular_members (
id INT PRIMARY KEY AUTO_INCREMENT,
extracurricular_id INT,
student_name VARCHAR(255),
class VARCHAR(50),
position VARCHAR(100),
FOREIGN KEY (extracurricular_id) REFERENCES extracurriculars(id)
);

CREATE TABLE agendas (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
description TEXT,
event_date DATE,
event_time TIME,
location VARCHAR(255),
organizer VARCHAR(255),
image VARCHAR(255),
status ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE virtual_tour_locations (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
description TEXT,
order_position INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE virtual_tour_images (
id INT PRIMARY KEY AUTO_INCREMENT,
location_id INT,
image_path VARCHAR(255) NOT NULL,
panorama_data TEXT,
hotspot_info TEXT,
order_position INT DEFAULT 0,
FOREIGN KEY (location_id) REFERENCES virtual_tour_locations(id)
);

CREATE TABLE alumni_submissions (
id INT PRIMARY KEY AUTO_INCREMENT,
alumni_name VARCHAR(255) NOT NULL,
graduation_year YEAR,
major VARCHAR(255),
current_occupation VARCHAR(255),
company VARCHAR(255),
story TEXT,
photo VARCHAR(255),
nisn VARCHAR(50),
diploma_photo VARCHAR(255),
submitted_by INT,
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
verified_by INT,
verified_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (submitted_by) REFERENCES users(id),
FOREIGN KEY (verified_by) REFERENCES users(id)
);

CREATE TABLE alumni_profiles (
id INT PRIMARY KEY AUTO_INCREMENT,
submission_id INT UNIQUE,
display_order INT DEFAULT 0,
featured BOOLEAN DEFAULT FALSE,
FOREIGN KEY (submission_id) REFERENCES alumni_submissions(id)
);

CREATE TABLE comments (
id INT PRIMARY KEY AUTO_INCREMENT,
content_type ENUM('news', 'achievement', 'agenda', 'facility'),
content_id INT,
user_id INT,
comment_text TEXT NOT NULL,
parent_id INT,
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
approved_by INT,
approved_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE comment_likes (
id INT PRIMARY KEY AUTO_INCREMENT,
comment_id INT,
user_id INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (comment_id) REFERENCES comments(id),
FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE important_notices (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
content TEXT,
notice_type ENUM('ppdb', 'pengumuman', 'info_penting'),
priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
display_until DATE,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE school_regulations (
id INT PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
content TEXT,
document_file VARCHAR(255),
category ENUM('siswa', 'guru', 'umum'),
order_position INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_info (
id INT PRIMARY KEY AUTO_INCREMENT,
info_type ENUM('address', 'phone', 'email', 'social_media'),
label VARCHAR(255),
value VARCHAR(255),
icon VARCHAR(255),
order_position INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE contact_messages (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
subject VARCHAR(255),
message TEXT NOT NULL,
status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE website_settings (
id INT PRIMARY KEY AUTO_INCREMENT,
setting_key VARCHAR(255) UNIQUE,
setting_value TEXT,
setting_type ENUM('text', 'image', 'url', 'boolean'),
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu Navigation
CREATE TABLE navigation_menu (
id INT PRIMARY KEY AUTO_INCREMENT,
menu_name VARCHAR(255) NOT NULL,
menu_url VARCHAR(255),
parent_id INT,
menu_type ENUM('internal', 'external', 'dropdown'),
order_position INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Relasi utama :
Users → News (author)
Users → Comments (user_id)
Users → Alumni Submissions (submitted_by, verified_by)
Majors → Competencies
Teachers → School Structure
Extracurriculars → Extracurricular Members
Virtual Tour Locations → Virtual Tour Images
Alumni Submissions → Alumni Profiles
